import React, { useReducer, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import * as sessionActions from "../../store/session";
import { useHistory } from "react-router";
import { useModal } from "../../context/Modal";
import { motion, AnimatePresence } from "framer-motion";

function Navigation({ isLoaded }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session?.user);
  console.log("sessionUser in navigation index", sessionUser);

  const currentUserGroups = useSelector(
    (state) => state.groups.currentUserGroups
  );
  let sessionLinks;

  const { setShowLogin, setShowSignUp } = useModal();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const loginButton = () => {
    setShowLogin(true);
  };
  const signUpButton = () => {
    setShowSignUp(true);
  };

  const handleDemoLoginClick = () => {
    return dispatch(
      sessionActions.fetchLogin({
        credential: "demoEdgar",
        password: "password",
      })
    ).then(() => history.push("/"));
    // .then(() => window.location.reload());
  };

  useEffect(() => {}, [sessionUser]);

  if (sessionUser && sessionUser !== undefined) {
    sessionLinks = (
      <ul className="profileButtonUl">
        <li>
          <ProfileButton
            className={`profileButtonComponent`}
            sessionUser={sessionUser}
          />
        </li>
      </ul>
    );
  } else {
    sessionLinks = (
      <AnimatePresence mode="wait">
        <motion.ul className="sessionLinksUl">
          <li>
            <button
              onClick={handleDemoLoginClick}
              className={`loginSignup demoLogin underline-animation`}
            >
              Demo Login
            </button>
            <button
              className={`loginSignup underline-animation`}
              onClick={loginButton}
            >
              Login
            </button>
            <button
              className={`loginSignup underline-animation`}
              onClick={signUpButton}
            >
              Sign Up
            </button>
          </li>
        </motion.ul>
      </AnimatePresence>
    );
  }

  return (
    <div className="mainNavDiv">
      <ul className="navUl">
        <li className="homeButtonLi">
          <NavLink className="homeButton" exact to={`/`}>
            Meetup
          </NavLink>
        </li>
        {<li className="navLi">{isLoaded && sessionLinks}</li>}
      </ul>
    </div>
  );
}

export default Navigation;
