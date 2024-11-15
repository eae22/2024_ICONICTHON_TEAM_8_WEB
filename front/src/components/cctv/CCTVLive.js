import React, { useRef, useState, useEffect } from "react";
import "./CCTVLive.css";

function CCTVLive() {
  const videoRef = useRef(null);
  const [detectedClasses, setDetectedClasses] = useState([]);
  const [storedImages, setStoredImages] = useState([]);
  const DETECT_URL = "/yolo/detect";
  const SAVE_IMAGE_URL = "/save-image";
  const GET_IMAGES_URL = "/get-images";

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("웹캠 초기화 실패:", err));
  }, []);

  const sendFrameToServer = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg")
    );

    const formData = new FormData();
    formData.append("image", blob, "frame.jpg");

    try {
      const response = await fetch(DETECT_URL, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setDetectedClasses(data.detections || []);
    } catch (error) {
      console.error("서버 요청 실패:", error);
    }
  };

  const fetchStoredImages = async () => {
    try {
      const response = await fetch(GET_IMAGES_URL);
      const data = await response.json();
      setStoredImages(data.images || []);
    } catch (error) {
      console.error("이미지 가져오기 실패:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      sendFrameToServer();
      fetchStoredImages();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>YOLOv8 Object Detection</h1>
      <video ref={videoRef} autoPlay muted style={{ width: "100%" }}></video>
      <ul>
        {detectedClasses.map((cls, idx) => (
          <li key={idx}>
            {cls.class} - {cls.confidence.toFixed(2)}
          </li>
        ))}
      </ul>
      <div>
        {storedImages.map((img, idx) => (
          <img
            key={idx}
            src={`data:image/jpeg;base64,${img}`}
            alt={`stored ${idx}`}
            width={250}
            height={250}
          />
        ))}
      </div>
    </div>
  );
}

export default CCTVLive;
