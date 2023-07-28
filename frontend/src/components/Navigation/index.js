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
  const sessionUser = useSelector((state) => state.session?.user);
  let sessionLinks;

  const { setShowLogin, setShowSignUp } = useModal();

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
    );
  };

  useEffect(() => {}, [sessionUser]);

  if (sessionUser && sessionUser !== undefined) {
    sessionLinks = (
      <motion.ul
        key={"profileButtonUl"}
        className="profileButtonUl"
        initial={{ opacity: 0, scale: 0, x: 100 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, x: 100, transition: { duration: 0.1 } }}
        transition={{ duration: 0.2 }}
      >
        <li>
          <ProfileButton
            className={`profileButtonComponent`}
            sessionUser={sessionUser}
          />
        </li>
      </motion.ul>
    );
  } else {
    sessionLinks = (
      <motion.ul
        key={"sessionLinksUl"}
        className="sessionLinksUl"
        initial={{ opacity: 0, scale: 0, y: -100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, y: -100, transition: { duration: 0.1 } }}
        transition={{ duration: 0.2 }}
      >
        <li>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleDemoLoginClick}
            className={`loginSignup demoLogin underline-animation`}
          >
            Demo Login
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className={`loginSignup underline-animation`}
            onClick={loginButton}
          >
            Login
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className={`loginSignup underline-animation`}
            onClick={signUpButton}
          >
            Sign Up
          </motion.button>
        </li>
      </motion.ul>
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
        {
          <AnimatePresence>
            <li className="navLi">{isLoaded && sessionLinks}</li>
          </AnimatePresence>
        }
      </ul>
    </div>
  );
}

export default Navigation;
