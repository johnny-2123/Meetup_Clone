import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { fetchUpcomingEvents } from "../../store/events";
import { useModal } from "../../context/Modal";
import UpcomingEvents from "./upcomingEvents";
import LandingHeader from "./LandingHeader";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./HomePage.module.css";

const HomePage = () => {
  const sessionUser = useSelector((state) => state.session?.user);
  const [userLoggedIn, setUserLoggedIn] = useState(true);
  let welcomeMessageClass = styles.WelcomeMessage;

  useEffect(() => {
    if (sessionUser?.user) {
      setUserLoggedIn(true);
    } else {
      setUserLoggedIn(false);
    }
  }, [sessionUser]);

  const { setShowSignUp } = useModal();

  return (
    <div className={styles.containerHome}>
      <LandingHeader
        sessionUser={sessionUser}
        userLoggedIn={userLoggedIn}
        welcomeMessageClass={welcomeMessageClass}
      />
      <div className={styles.homeMiddleSection}>
        <h2>How Meetup works</h2>
        <p>
          Meet new people who share your interests through online and in-person
          events. It's free to create an account.{" "}
        </p>
      </div>
      <div className={styles.homeThirdSection}>
        <div className={styles.homeThirdSectionDiv}>
          <i className="fa-solid fa-handshake "></i>
          <NavLink className={styles["homePageSection3Links"]} to="/groups">
            See All Groups
          </NavLink>
          <p>
            Do what you love, meet others who love it, find your community. The
            rest is history!
          </p>
        </div>
        <div className={styles.homeThirdSectionDiv}>
          <i className="fa-solid fa-ticket"></i>
          <NavLink className={styles["homePageSection3Links"]} to="/events">
            Find an Event
          </NavLink>
          <p>
            Events are happening on just about any topic you can think of, from
            online gaming and photography to yoga and hiking.
          </p>
        </div>
        <div
          id={
            sessionUser
              ? styles.homeThirdSectionDiv
              : styles.homeThirdSectionDivDisabled
          }
          className={styles.homeThirdSectionDiv}
        >
          <i className="fa-solid fa-people-group"></i>
          <NavLink className={styles["homePageSection3Links"]} to="/groups/new">
            Start a Group
          </NavLink>
          <p>
            You don't have to be an expert to gather people together and explore
            shared interests.
          </p>
        </div>
      </div>
      <div className={styles.homeFourthSection}>
        {!sessionUser && (
          <button
            className={styles.joinButton}
            onClick={() => setShowSignUp(true)}
          >
            Join Meetup
          </button>
        )}
      </div>
      <UpcomingEvents />

      <div className={styles.homePageFooter}>
        <a
          className={styles.homePageFooterLinks}
          href={"https://github.com/johnny-2123/Project1/wiki"}
          target="_blank"
        >
          <i className="fa-brands fa-github"></i>
        </a>
        <a
          className={styles.homePageFooterLinks}
          href={"https://www.linkedin.com/in/johnny-avila-0512aa164/"}
          target="_blank"
        >
          <i className="fa-brands fa-linkedin"></i>
        </a>
        <a
          className={`${styles.homePageFooterLinks} wellfound`}
          href={"https://wellfound.com/profile/edit/overview"}
          target="_blank"
        >
          W:
        </a>
      </div>
    </div>
  );
};

export default HomePage;
