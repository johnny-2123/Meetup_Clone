import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImageUpload from "./ImageUpload";
import styles from "./EventGallery.module.css";

const EventGallery = ({ event }) => {
  const dispatch = useDispatch();
  const [images, setImages] = useState(null);
  console.log("images", images);
  const eventImages = useSelector((state) => state?.currentEvent?.EventImages);
  console.log("eventImages useSelector in image gallery", eventImages);
  useEffect(() => {
    console.log(
      `*********************images in useEffect in event gallery:`,
      event?.EventImages
    );
    setImages(event?.EventImages);
  }, [eventImages]);

  const imagesMapped = images?.map((image) => {
    console.log(`*********************image:`, image);
    return (
      <div key={image?.id}>
        <img src={image?.url} />
      </div>
    );
  });

  return (
    <div className={styles.eventGallery}>
      <h1>Event Gallery</h1>
      {images && imagesMapped}
      <ImageUpload event={event} images={images} setImages={setImages} />
    </div>
  );
};

export default EventGallery;
