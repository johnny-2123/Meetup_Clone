import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import * as sessionActions from "../../store/session";
import { motion, AnimatePresence } from "framer-motion";
<script
  src="https://kit.fontawesome.com/97726b2eee.js"
  crossorigin="anonymous"
></script>;

const ProfileButton = ({ sessionUser }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { username, firstName, email, lastName } =
    sessionUser?.user || sessionUser;
  const ulRef = useRef();
  const [showMenu, setShowMenu] = useState(false);

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.fetchLogout());
    history.push("/");
  };

  const SeeMyGroups = (e) => {
    e.preventDefault();
    history.push(`/groups/current`);
  };

  const SeeAllGroups = (e) => {
    e.preventDefault();
    history.push(`/groups`);
  };

  const SeeAllEvents = (e) => {
    e.preventDefault();
    history.push(`/events`);
  };
  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button className="profileButton" onClick={openMenu}>
        <i className="fas fa-user-circle profileIcon" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        <li className="navDropLi navBioInfo">{username}</li>
        <li className="navDropLi navBioInfo">
          {firstName} {lastName}
        </li>
        <li className="navDropLi navBioInfo">{email}</li>
        <li className="navDropLi">
          <button className="logoutButton" onClick={SeeMyGroups}>
            {" "}
            See My Groups
          </button>
        </li>
        <li className="navDropLi">
          <button className="logoutButton" onClick={SeeAllGroups}>
            {" "}
            See All Groups
          </button>
        </li>
        <li className="navDropLi">
          <button className="logoutButton" onClick={SeeAllEvents}>
            {" "}
            See All Events
          </button>
        </li>
        <li className="navDropLi">
          <button className="logoutButton" onClick={logout}>
            Log Out
          </button>
        </li>
      </ul>
    </>
  );
};

export default ProfileButton;
