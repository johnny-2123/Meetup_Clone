import React, { useState } from "react";
import DragDropFiles from "./DragDropFiles";
import styles from "./ImageUpload.module.css";

const ImageUpload = ({ event, images, setImages }) => {
  const [files, setFiles] = useState(null);

  return (
    <div>
      <h1>Image Upload</h1>
      <DragDropFiles
        files={files}
        setFiles={setFiles}
        event={event}
        images={images}
        setImages={setImages}
      />
    </div>
  );
};

export default ImageUpload;
