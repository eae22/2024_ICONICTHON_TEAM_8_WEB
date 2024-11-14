import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import LocationIcon from "../../images/LocationIcon.png";
import "./CCTVLive.css";

function CCTVLive() {
  const navigate = useNavigate();
  const { location } = useParams(); // URL 파라미터에서 location 가져오기
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // 상태 변수들
  const [detectedClasses, setDetectedClasses] = useState([]);
  const [storedImages, setStoredImages] = useState([]);
  const [isPosted, setIsPosted] = useState(false); // 게시 여부
  const [isClaimed, setIsClaimed] = useState(false); // 회수 여부
  const [storageLocation, setStorageLocation] = useState("");
  const [lostTime, setLostTime] = useState("");
  const [lostLocation, setLostLocation] = useState("");
  const [itemType, setItemType] = useState("");
  const [captureTime, setCaptureTime] = useState(null); // 이미지 캡쳐 시간
  const DETECT_URL = "/yolo/detect";
  const SAVE_IMAGE_URL = "/save-image";
  const GET_IMAGES_URL = "/get-images";
  const POST_TO_BOARD_URL = "/post-to-board"; // 게시판에 포스트할 API

  // location에 따른 storageLocation, lostLocation 설정
  useEffect(() => {
    if (location === "infoculture") {
      setLostLocation("정보문화관 P 402 인쇄실");
      setStorageLocation("정보문화관 P 402 인쇄실");
    } else if (location === "newengineering-building-3") {
      setLostLocation("신공학관 3층 인쇄실");
      setStorageLocation("신공학관 3층 인쇄실");
    } else if (location === "newengineering-building-9") {
      setLostLocation("신공학관 9층 인쇄실");
      setStorageLocation("신공학관 9층 인쇄실");
    } else if (location === "wonheung") {
      setLostLocation("원흥관 3층 인쇄실");
      setStorageLocation("원흥관 3층 인쇄실");
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

  // YOLO API에 프레임 전송 및 감지된 객체 업데이트
  const sendFrameToServer = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject("Blob could not be created");
        }
      }, "image/jpeg");
    });

    const formData = new FormData();
    formData.append("image", blob, "frame.jpg");

    try {
      const response = await fetch(DETECT_URL, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`YOLO API 요청 실패: ${response.statusText}`);
      }
      const data = await response.json();
      setDetectedClasses(data.detections || []);

      if (data.detections && data.detections.length > 0) {
        const detectedItem = data.detections[0];
        setItemType(detectedItem.class || "미탐지");
        setCaptureTime(new Date().toISOString()); // 이미지 캡쳐 시간 저장
        setLostTime(new Date().toISOString()); // lostTime을 이미지 캡처 시간으로 설정
        saveImage(blob, detectedItem.class); // 이미지 저장
      }
    } catch (error) {
      console.error(`YOLO API 요청 실패: ${error.message}`);
    }
  };

  // 주기적으로 프레임 전송
  useEffect(() => {
    const interval = setInterval(() => {
      sendFrameToServer();
    }, 5000); // 5초마다 호출
    return () => clearInterval(interval);
  }, []);

  // 이미지를 서버로 저장
  const saveImage = async (imageBlob, detectedClassName) => {
    const formData = new FormData();
    formData.append("image", imageBlob, "frame.jpg");
    formData.append("name", detectedClassName);

    try {
      const response = await fetch(SAVE_IMAGE_URL, {
        method: "POST",
        body: formData,
      });
      if (response.status === 200) {
        console.log("이미지 저장 성공");
        fetchStoredImages(); // 저장된 이미지 목록 갱신
      } else {
        console.error("이미지 저장 실패");
      }
    } catch (error) {
      console.error("이미지 저장 중 오류 발생:", error);
    }
  };

  // 저장된 이미지 가져오기
  const fetchStoredImages = async () => {
    try {
      const response = await fetch(GET_IMAGES_URL);
      if (!response.ok) {
        throw new Error("저장된 이미지를 가져오는 데 실패했습니다.");
      }
      const data = await response.json();
      setStoredImages(data.images || []);
    } catch (error) {
      console.error("이미지 가져오기 실패:", error);
    }
  };

  // 컴포넌트 마운트 시 저장된 이미지 가져오기
  useEffect(() => {
    fetchStoredImages();
  }, []);

  // 게시판에 데이터 전송
  const postToBoard = async (itemData) => {
    try {
      const response = await fetch(POST_TO_BOARD_URL, {
        method: "POST",
        body: JSON.stringify(itemData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        alert("전체게시판에 게시되었습니다.");
      } else {
        console.error("게시 실패");
      }
    } catch (error) {
      console.error("게시 오류:", error);
    }
  };

  // 회수 버튼 클릭 시 상태 업데이트
  const handleClaim = async (img) => {
    // 기본 itemData 설정
    const itemData = {
      itemType,
      lostTime: captureTime,
      lostLocation,
      isPosted: true, // 게시됨
      isClaimed: false, // 기본값: 회수되지 않음
      storageLocation,
    };

    // location에 맞는 storageLocation 업데이트
    if (lostLocation === "정보문화관 P 402 인쇄실") {
      setStorageLocation("정보문화관 P 402 경비실");
    } else if (lostLocation === "신공학관 3층 인쇄실") {
      setStorageLocation("신공학관 3층 경비실");
    } else if (lostLocation === "신공학관 9층 인쇄실") {
      setStorageLocation("신공학관 9층 경비실");
    } else if (lostLocation === "원흥관 3층 인쇄실") {
      setStorageLocation("원흥관 3층 경비실");
    }

    // 10분 이내에 회수 버튼을 눌렀을 때
    setIsClaimed(true);
    setIsPosted(true);

    itemData.isClaimed = true; // 회수됨으로 설정

    // 백엔드로 회수된 데이터 전송
    try {
      await postToBoard(itemData);
      // 회수된 항목은 목록에서 삭제
      setStoredImages((prevImages) =>
        prevImages.filter((image) => image !== img)
      );
      console.log("회수 성공, 경비실로 변경되었습니다.");
    } catch (error) {
      console.error("회수 처리 중 오류 발생:", error);
    }
  };

  // 10분이 지난 후 회수 버튼을 눌렀을 때, 이미 저장된 정보에서 storageLocation 업데이트
  const handleUpdateAfterTimeout = async (img) => {
    // 10분이 지나고 회수 버튼이 눌린 경우, 이미 저장된 데이터에서 `storageLocation`을 경비실로 업데이트
    const updatedItemData = {
      itemType,
      lostTime: captureTime,
      lostLocation,
      isPosted: true,
      isClaimed: true, // 회수됨으로 처리
      // storageLocation을 경비실로 변경
      storageLocation: storageLocation.replace("인쇄실", "경비실"),
    };

    try {
      await postToBoard(updatedItemData); // 업데이트된 데이터 백엔드에 전송
      setStoredImages((prevImages) =>
        prevImages.filter((image) => image !== img)
      ); // 목록에서 이미지 삭제
      console.log("업데이트되었습니다.");
    } catch (error) {
      console.error("업데이트 오류 발생:", error);
    }
  };

  // 회수 버튼 클릭 시 처리하는 로직
  const handleClaimClick = (img) => {
    const timePassed = new Date() - new Date(captureTime); // 캡처 시간과 현재 시간 차이 계산

    if (timePassed <= 600000) {
      handleClaim(img); // 10분 이내 회수
    } else {
      handleUpdateAfterTimeout(img); // 10분 이후 회수
    }
  };

  // 10분이 지나면 자동으로 백엔드에 저장
  useEffect(() => {
    if (!captureTime || isClaimed) return;

    const interval = setInterval(() => {
      const timePassed = new Date() - new Date(captureTime); // 캡처 시간과 현재 시간 차이 계산
      if (timePassed > 600000 && !isClaimed) {
        const itemData = {
          itemType,
          lostTime: captureTime,
          lostLocation,
          isPosted: true, // 게시됨
          isClaimed: false, // 회수되지 않음
          storageLocation,
        };

        postToBoard(itemData); // 자동으로 10분 후 백엔드에 저장
        console.log(
          "10분이 지나 회수되지 않으면 자동으로 백엔드에 저장됩니다."
        );
        clearInterval(interval);
      }
    }, 60000); // 1분마다 체크

    return () => clearInterval(interval);
  }, [captureTime, isClaimed]);

  return (
    <div>
      <div className="CCTVLive_video">
        <video ref={videoRef} autoPlay muted style={{ width: "90%" }}></video>
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
                <div className="CCTVLive_isPosted_text_layout">
                  <div
                    className={`CCTVLive_isPosted_text ${
                      isPosted ? "published" : ""
                    }`}
                  >
                    {isPosted ? "회수대기" : "게시대기"}
                  </div>
                </div>
              </div>
              <div className="CCTVLive_Bottom_text_layout">
                <div className="CCTVLive_itemType_lostTime_layout">
                  <div className="CCTVLive_itemType">{`${
                    itemType || "분실물"
                  }`}</div>
                  <div className="CCTVLive_lostTime">{`${
                    lostTime || "분실 시간"
                  }`}</div>
                </div>
                <div className="CCTVLive_lostLocation_layout">
                  <img src={LocationIcon} alt={"장소"} width={12} />
                  <div className="CCTVLive_lostLocation_text">{`${
                    lostLocation || "분실 장소"
                  }`}</div>
                </div>
              </div>
              <div className="CCTVLive_isClaimed_btn_layout">
                <button
                  className="CCTVLive_isClaimed_btn"
                  onClick={() => handleClaimClick(img)}
                >
                  회수
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CCTVLive;
