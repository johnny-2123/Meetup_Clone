import React, { useState } from "react";
import DragDropFiles from "./DragDropFiles";
import styles from "./ImageUpload.module.css";

const ImageUpload = () => {
  const [files, setFiles] = useState(null);

  return (
    <div>
      <h1>Image Upload</h1>
      <DragDropFiles files={files} setFiles={setFiles} />
    </div>
  );
};

export default ImageUpload;
