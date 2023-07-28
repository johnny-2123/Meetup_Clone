import React, { useEffect, useState } from "react";
import styles from "./LandingHeader.module.css";
import { motion, AnimatePresence } from "framer-motion";

const LandingHeader = ({ sessionUser, userLoggedIn, welcomeMessageClass }) => {
  const [welcomeMessage, setWelcomeMessage] = useState("");
  useEffect(() => {
    if (sessionUser?.user) {
      setWelcomeMessage(sessionUser?.user?.firstName);
    } else if (sessionUser) {
      setWelcomeMessage(sessionUser?.firstName);
    } else {
      setWelcomeMessage("");
    }
  }, [sessionUser]);
  return (
    <>
      <section className={styles.landingTopSection}>
        <div className={styles.landingHeader}>
          <AnimatePresence mode="wait">
            <div className={styles.landingHeaderInfo}>
              {sessionUser && (
                <motion.h2
                  key={"welcomeMessage"}
                  className={styles.WelcomeMessage}
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.2 }}
                >
                  Welcome {welcomeMessage}
                </motion.h2>
              )}
              <h1>
                The people platform - <br></br> Where interests become
                friendships
              </h1>
            </div>
          </AnimatePresence>
          <img
            className={styles.homePageImage}
            src="https://res.cloudinary.com/dkul3ouvi/image/upload/v1690060525/vecteezy_back-view-of-man-and-woman-friends-standing-together_5638987_xppydz-removebg-preview_1_lf9jtb.png"
            alt="Friends Vector by Vecteezy"
          />
          <div className={styles.blob}></div>
        </div>
        <div className={styles["custom-shape-divider-bottom-1690059328"]}>
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M1200 120L0 16.48 0 0 1200 0 1200 120z"
              class="shape-fill"
              className={styles["shape-fill"]}
            ></path>
          </svg>
        </div>
      </section>
    </>
  );
};

export default LandingHeader;
