import React, { useState, useRef } from "react";
import { storage } from "../../../../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
// import { doc, collection, setDoc, getDocs } from "firebase/firestore";
import { fetchCreateEventImage } from "../../../../../store/events";
import { toast } from "react-toastify";
import styles from "./DragDropFiles.module.css";

const DragDropFiles = ({ files, setFiles, event, setImages, images }) => {
  // console.log(`*********************event in drag drop component:`, event);
  const dispatch = useDispatch();
  const inputRef = useRef();
  const dropZoneRef = useRef();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    dropZoneRef.current.classList.add(styles.dragOver);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    dropZoneRef.current.classList.add(styles.dragOver);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    dropZoneRef.current.classList.remove(styles.dragOver);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setFiles(e.dataTransfer.files[0]);
    const newImageUrl = URL.createObjectURL(e.dataTransfer.files[0]);
    setPreviewImage(newImageUrl);
    dropZoneRef.current.classList.remove(styles.dragOver);
    console.log("files", files);
  };

  const handleUpload = async () => {
    const subFolderName = event?.id;
    if (!files)
      return {
        alert: "No files selected",
      };

    // toast.info("Uploading image...", { autoClose: true });

    const imageRef = ref(
      storage,
      `events/${subFolderName}/images/${files.name}`
    );

    await uploadBytes(imageRef, files);

    const downloadURL = await getDownloadURL(imageRef);
    console.log(`File available at ${downloadURL}`);
    const preview = true;
    const eventId = event.id;
    const name = files.name;

    dispatch(fetchCreateEventImage(eventId, downloadURL, preview, name))
      .then((response) => {
        console.log("fetched image upload response", response);
        setImages([...images, response]);
        setPreviewImage(null);
        setFiles(null);
        toast.success("Image uploaded successfully");
      })
      .catch((err) => {
        console.log("fetched image upload error", err);
        toast.error("Error uploading image");
      });
    setUploaded(true);
  };
  return (
    <div id={styles.dragDropFiles}>
      {files && (
        <div className={styles.uploads}>
          {previewImage && (
            <img className={styles.uploads} src={previewImage} alt="preview" />
          )}
          <ul>
            <li>{files.name}</li>
          </ul>
          <div className={styles.actions}>
            <button
              className={styles.cancelButton}
              onClick={() => {
                setPreviewImage(null);
                setFiles(null);
              }}
            >
              Cancel
            </button>
            <button onClick={handleUpload}>Upload</button>
          </div>
        </div>
      )}
      {!files && (
        <div
          className={styles.dropZone}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          ref={dropZoneRef}
        >
          <h1>Drag and Drop files to Upload</h1>
          <h1>Or</h1>
          <input
            type="file"
            // multiple
            onChange={(e) => {
              console.log("files in input change: ", e.target.files);
              const newImageUrl = URL.createObjectURL(e.target.files[0]);
              setPreviewImage(newImageUrl);
              setFiles(e.target.files[0]);
            }}
            hidden
            accept="image/png, image/jpeg, image/jpg"
            ref={inputRef}
          />
          <button onClick={() => inputRef.current.click()}>Select Files</button>
        </div>
      )}
    </div>
  );
};

export default DragDropFiles;
