import React, { useState, useRef } from "react";
import styles from "./DragDropFiles.module.css";
const DragDropFiles = ({ files, setFiles }) => {
  const inputRef = useRef();

  const handleDragOver = (e) => {
    e.preventDefault();
    console.log(
      `Drag Over *********************e.dataTransfer.files:`,
      e.dataTransfer.files
    );
  };

  const handleDrop = (e) => {
    e.preventDefault();
    console.log(
      `Drop Over*********************e.dataTransfer.files:`,
      e.dataTransfer.files
    );
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("Files", files);
    console.log(formData.getAll());
    // fetch(
    //   "link", {
    //     method: "POST",
    //     body: formData
    //   }
    // )
  };
  return (
    <div id={styles.dragDropFiles}>
      {files && (
        <div className={styles.uploads}>
          <ul>
            {Array.from(files).map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))}
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
            multiple
            onChange={(e) => setFiles(e.target.files)}
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
