import React, { useState } from "react";

function CCTVLive() {
  const [blobUrl, setBlobUrl] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/yolo/detect", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
      } else {
        console.error("Failed to process image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div>
      <h1>CCTV YOLO Detection</h1>
      <input type="file" accept="image/*" onChange={handleFileUpload} />
      {blobUrl && (
        <div>
          <h2>Detection Result</h2>
          <img src={blobUrl} alt="Detection Result" />
        </div>
      )}
    </div>
  );
}

export default CCTVLive;
