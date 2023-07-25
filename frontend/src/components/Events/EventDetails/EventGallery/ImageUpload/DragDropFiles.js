import React, { useState, useRef } from "react";
import styles from "./DragDropFiles.module.css";
import { storage } from "../../../../../config/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, collection, setDoc, getDocs } from "firebase/firestore";

const DragDropFiles = ({ files, setFiles, event }) => {
  // console.log(`*********************event in drag drop component:`, event);

  const inputRef = useRef();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    console.log(
      `Drag Over *********************e.dataTransfer.files:`,
      e.dataTransfer.files
    );
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFiles(e.target.files[0]);
    console.log(
      `Drop Over*********************e.dataTransfer.files:`,
      e.dataTransfer.files
    );
    console.log("files", files);
  };

  const handleUpload = () => {
    const subFolderName = event?.id;
    if (!files)
      return {
        alert: "No files selected",
      };
    // const formData = new FormData();
    // formData.append("Files", files);
    // console.log(formData.getAll());
    const storageRef = ref(
      storage,
      `events/${subFolderName}/images/${files.name}`
    );

    const uploadTask = uploadBytesResumable(storageRef, files[0]);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log(`File available at ${downloadURL}`);
        });
        setUploaded(true);
      }
    );
  };
  return (
    <div id={styles.dragDropFiles}>
      {files && (
        <div className={styles.uploads}>
          <ul>
            {/* {Array.from(files).map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))} */}
            <li>{files.name}</li>
          </ul>
          <div className={styles.actions}>
            <button
              className={styles.cancelButton}
              onClick={() => setFiles(null)}
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
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <h1>Drag and Drop files to Upload</h1>
          <h1>Or</h1>
          <input
            type="file"
            // multiple
            onChange={(e) => {
              console.log("files in input change: ", e.target.files);
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
