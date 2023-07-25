import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImageUpload from "./ImageUpload";
import styles from "./EventGallery.module.css";

const EventGallery = ({ event }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(
      `*********************event in event gallery:`,
      event?.EventImages
    );
  }, [event?.images]);

  return (
    <div className={styles.eventGallery}>
      <h1>Event Gallery</h1>
      <ImageUpload event={event} />
    </div>
  );
};

export default EventGallery;
