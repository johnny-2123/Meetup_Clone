import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImageUpload from "./ImageUpload";
import styles from "./EventGallery.module.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

  const contentStyle = {
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.8)",
    border: "none",
    positon: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    padding: "0",
  };

  const imagesMapped = images?.map((image) => {
    console.log(`*********************image:`, image);
    return (
      <Popup
        key={image?.id}
        trigger={
          <div className={styles.imageContainer}>
            <img src={image?.url} />
          </div>
        }
        modal
        nested
        contentStyle={contentStyle}
      >
        {(close) => (
          <div className={styles.modal}>
            <button className={styles.close} onClick={close}>
              &times;
            </button>
            <button className={styles.trash}>
              <i class="fa-solid fa-trash-can"></i>
            </button>
            <img className={styles.modalImage} src={image?.url} />
          </div>
        )}
      </Popup>
    );
  });

  return (
    <div className={styles.eventGallery}>
      <h1>Event Gallery</h1>
      <div className={styles.imagesCollection}>{images && imagesMapped}</div>
      <ImageUpload event={event} images={images} setImages={setImages} />
    </div>
  );
};

export default EventGallery;
