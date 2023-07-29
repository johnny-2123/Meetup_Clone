import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImageUpload from "./ImageUpload";
import styles from "./EventGallery.module.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { fetchDeleteEventImage } from "../../../../store/events";
import { storage } from "../../../../config/firebase";
import { ref, deleteObject } from "firebase/storage";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";

const EventGallery = ({ event, sessionUser }) => {
  const dispatch = useDispatch();
  const [images, setImages] = useState(null);
  const eventImages = useSelector((state) => state?.currentEvent?.EventImages);
  const [imageDeleting, setImageDeleting] = useState(false);
  const isEventOrganizer = sessionUser?.user?.id === event?.Organizer?.id;
  console.log("isEventOrganizer", isEventOrganizer);
  console.log("event in event gallery", event);
  console.log("sessionUser in event gallery", sessionUser);

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
    const subFolderName = event?.id;
    const imageRef = ref(storage, `events/${subFolderName}/images/${name}`);

    try {
      setImageDeleting(true);
      // toast.info("Deleting image...", { autoClose: false });

      await deleteObject(imageRef);
    } catch (error) {
      toast.error("Error deleting image", { hideProgressBar: true });
    } finally {
      dispatch(fetchDeleteEventImage(eventId, imageId))
        .then((response) => {
          setImageDeleting(false);
          setImages(
            images.filter((image) => image.id !== response?.deletedEvent?.id)
          );
          toast.success("Image deleted successfully", {
            hideProgressBar: true,
          });
        })
        .catch((error) => {});
    }
  };

  const imagesMapped = images?.map((image) => {
    return (
      <Popup
        key={image?.id}
        trigger={
          <motion.div
            className={styles.imageContainer}
            whileHover={{ scale: 0.9 }}
          >
            <img className={styles.eventThumbnail} src={image?.url} />
          </motion.div>
        }
        modal
        nested
        contentStyle={contentStyle}
        closeOnDocumentClick={false}
      >
        {(close) => (
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <button className={styles.close} onClick={close}>
              &times;
            </button>
            {isEventOrganizer && (
              <button className={styles.trash}>
                <i
                  className={`fa-solid fa-trash-can`}
                  onClick={(e) =>
                    handleDeleteImage(e, event?.id, image?.id, image?.name)
                  }
                ></i>
              </button>
            )}
            <img className={styles.modalImage} src={image?.url} />
          </motion.div>
        )}
      </Popup>
    );
  });
  return (
    <div className={styles.eventGallery}>
      <h1 className={styles.eventGallery}>Event Gallery</h1>
      {images && !images?.length && (
        <div className={styles.noImages}>
          <h1 className={styles.noImages}>No Images Uploaded Yet</h1>
        </div>
      )}
      <div className={styles.imagesCollection}>{images && imagesMapped}</div>
      {isEventOrganizer && (
        <ImageUpload event={event} images={images} setImages={setImages} />
      )}
    </div>
  );
};

export default EventGallery;
