import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImageUpload from "./ImageUpload";
import styles from "./EventGallery.module.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { fetchDeleteEventImage } from "../../../../store/events";
import { storage } from "../../../../config/firebase";
import { ref, deleteObject } from "firebase/storage";
import { toast } from "react-toastify";

const EventGallery = ({ event }) => {
  const dispatch = useDispatch();
  const [images, setImages] = useState(null);
  const eventImages = useSelector((state) => state?.currentEvent?.EventImages);

  useEffect(() => {
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

  const handleDeleteImage = async (e, eventId, imageId, name) => {
    e.preventDefault();
    console.log("handleDeleteImage", eventId, imageId, name);
    const subFolderName = event?.id;
    const imageRef = ref(storage, `events/${subFolderName}/images/${name}`);

    try {
      await deleteObject(imageRef);
    } catch (error) {
      console.log("an error occurred! deleting image", error);
    } finally {
      console.log("finally block executed deleted image from firestore");
      dispatch(fetchDeleteEventImage(eventId, imageId))
        .then((response) => {
          console.log("fetched delete image response", response);
          setImages(
            images.filter((image) => image.id !== response?.deletedEvent?.id)
          );
        })
        .catch((error) => {
          console.log("error deleting image from postgres", error);
        });
    }
  };

  const imagesMapped = images?.map((image) => {
    console.log(`*********************image:`, image);
    return (
      <Popup
        key={image?.id}
        trigger={
          <div className={styles.imageContainer}>
            <img className={styles.eventThumbnail} src={image?.url} />
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
              <i
                className="fa-solid fa-trash-can"
                onClick={(e) =>
                  handleDeleteImage(e, event?.id, image?.id, image?.name)
                }
              ></i>
            </button>
            <img className={styles.modalImage} src={image?.url} />
          </div>
        )}
      </Popup>
    );
  });

  return (
    <div className={styles.eventGallery}>
      <h1 className={styles.eventGallery}>Event Gallery</h1>
      <div className={styles.imagesCollection}>{images && imagesMapped}</div>
      <ImageUpload event={event} images={images} setImages={setImages} />
    </div>
  );
};

export default EventGallery;
