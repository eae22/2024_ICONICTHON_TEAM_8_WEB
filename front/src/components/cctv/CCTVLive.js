import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LocationIcon from "../../images/LocationIcon.png";
import "./CCTVLive.css";

function CCTVLive() {
  const navigate = useNavigate();
  const { location } = useParams();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // 상태 변수들
  const [detectedClasses, setDetectedClasses] = useState([]);
  const [storedImages, setStoredImages] = useState([]);
  const [lostLocation, setLostLocation] = useState("");
  const [storageLocation, setStorageLocation] = useState("");
  const [captureTime, setCaptureTime] = useState(null);
  const DETECT_URL = "/yolo/detect";
  const SAVE_IMAGE_URL = "/save-image";
  const GET_IMAGES_URL = "/get-images";

  // location에 따른 storageLocation 및 lostLocation 설정
  useEffect(() => {
    if (location === "infoculture") {
      setLostLocation("정보문화관 P 402 인쇄실");
      setStorageLocation("정보문화관 P 402 경비실");
    } else if (location === "newengineering-building-3") {
      setLostLocation("신공학관 3층 인쇄실");
      setStorageLocation("신공학관 3층 경비실");
    } else if (location === "newengineering-building-9") {
      setLostLocation("신공학관 9층 인쇄실");
      setStorageLocation("신공학관 9층 경비실");
    } else if (location === "wonheung") {
      setLostLocation("원흥관 3층 인쇄실");
      setStorageLocation("원흥관 3층 경비실");
    }
  }, [location]);

  // 웹캠 초기화
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("웹캠 초기화 실패:", err));
  }, []);

  // YOLO API에 프레임 전송
  const sendFrameToServer = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject("Blob 생성 실패");
      }, "image/jpeg");
    });

    const formData = new FormData();
    formData.append("image", blob, "frame.jpg");

    try {
      const response = await fetch(DETECT_URL, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setDetectedClasses(data.detections || []);
      setCaptureTime(new Date().toISOString());
      saveImage(blob);
    } catch (error) {
      console.error("YOLO API 요청 실패:", error);
    }
  };

  // 이미지 저장
  const saveImage = async (imageBlob) => {
    const formData = new FormData();
    formData.append("image", imageBlob, "frame.jpg");

    try {
      const response = await fetch(SAVE_IMAGE_URL, {
        method: "POST",
        body: formData,
      });
      if (response.ok) console.log("이미지 저장 성공");
      else console.error("이미지 저장 실패");
    } catch (error) {
      console.error("이미지 저장 중 오류 발생:", error);
    }
  };

  // 저장된 이미지 가져오기
  const fetchStoredImages = async () => {
    try {
      const response = await fetch(GET_IMAGES_URL);
      const data = await response.json();
      setStoredImages(data.images || []);
    } catch (error) {
      console.error("이미지 가져오기 실패:", error);
    }
  };

  // 주기적으로 YOLO 탐지 및 이미지 가져오기
  useEffect(() => {
    const interval = setInterval(() => {
      sendFrameToServer();
      fetchStoredImages();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="CCTVLive_video">
        <video ref={videoRef} autoPlay muted style={{ width: "90%" }}></video>
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        <div className="CCTVLive_video_BottomLine"></div>
      </div>

      <div>
        {storedImages.map((img, idx) => (
          <div key={idx} className="CCTVLive_Bottom_all_layout">
            <div className="CCTVLive_Bottom_all_size">
              <div className="CCTVLive_itemimg_isPosted_layout">
                <img
                  className="CCTVLive_itemImg"
                  src={`data:image/jpeg;base64,${img}`}
                  alt={`stored ${idx}`}
                  width={90}
                  height={90}
                />
              </div>
              <div className="CCTVLive_Bottom_text_layout">
                <div className="CCTVLive_itemType_lostTime_layout">
                  <div className="CCTVLive_itemType">분실물</div>
                  <div className="CCTVLive_lostTime">
                    {captureTime || "분실 시간"}
                  </div>
                </div>
                <div className="CCTVLive_lostLocation_layout">
                  <img src={LocationIcon} alt={"장소"} width={12} />
                  <div className="CCTVLive_lostLocation_text">
                    {lostLocation || "분실 장소"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CCTVLive;
