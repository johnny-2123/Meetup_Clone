import React, { useEffect, useRef, useState, useReducer } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import "./LoginForm.css";
import { useModal } from "../../context/Modal";

const LoginFormPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);

  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const { setShowLogin } = useModal();

  const ulRef = useRef();

  useEffect(() => {
    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowLogin(false);
      }
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  const handleXButtonClick = () => {
    setShowLogin(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    setErrors([]);
    return dispatch(sessionActions.fetchLogin({ credential, password })).catch(
      async (res) => {
        const data = await res.json();

        if (data && data.errors) {
          setErrors(data.errors);
        }
      }
    );
  };

  useEffect(() => {
    if (sessionUser && (sessionUser.username !== undefined || null)) {
      history.push("/");
      window.location.reload();
    }
  }, [sessionUser]);

  return (
    <>
      <div className="mainDiv">
        <div className="loginComponent" ref={ulRef}>
          <div className="xButtonDiv">
            <button onClick={handleXButtonClick} className="xButton">
              x
            </button>
          </div>
          <form className="loginForm" onSubmit={handleSubmit}>
            <div className="formBox">
              <label htmlFor="credentials" className="label">
                Username or Email
              </label>
              <input
                name="credentials"
                className="input"
                type={`text`}
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                required
              ></input>
            </div>
            <div className="formBox">
              <label for="password" className="label">
                Password
              </label>
              <input
                name="password"
                className="input"
                type={`password`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              ></input>
            </div>
            <button type="submit" className="submitButton">
              Log In
            </button>
            <ul className="errors">
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginFormPage;
