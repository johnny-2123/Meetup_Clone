import React from "react";
import ImageUpload from "./ImageUpload";

import styles from "./EventGallery.module.css";

const EventGallery = () => {
  return (
    <div className={styles.eventGallery}>
      <ImageUpload />
    </div>
  );
};

export default EventGallery;
