import React from "react";
import ImageUpload from "./ImageUpload";

import styles from "./EventGallery.module.css";

const EventGallery = ({ event }) => {
  return (
    <div className={styles.eventGallery}>
      <h1>Event Gallery</h1>
      <ImageUpload event={event} />
    </div>
  );
};

export default EventGallery;
