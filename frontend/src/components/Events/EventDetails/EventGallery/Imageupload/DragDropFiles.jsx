import { useState } from "react";
import "./ImageUpload.module.css";
const DragDropFiles = () => {
  const [files, setFiles] = useState([]);

  return (
    <div>
      {!files && (
        <div className="dropZone">
          <h1>Drag and Drop files to Upload</h1>
          <h1>Or</h1>
          <button>Select Files</button>
        </div>
      )}
    </div>
  );
};

export default DragDropFiles;
