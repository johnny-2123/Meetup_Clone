import React from "react";
import styles from "./LandingHeader.module.css";

const LandingHeader = ({ sessionUser, userLoggedIn, welcomeMessageClass }) => {
  return (
    <>
      <section className={styles.landingTopSection}>
        <div className={styles.landingHeader}>
          <div className={styles.landingHeaderInfo}>
            <h2 className={welcomeMessageClass}>
              Welcome {sessionUser?.user?.firstName}
            </h2>
            <h1>
              The people platform - <br></br> Where interests become friendships
            </h1>
          </div>
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
