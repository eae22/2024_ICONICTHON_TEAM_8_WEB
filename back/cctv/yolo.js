const express = require("express");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");
const sharp = require("sharp");
const mysql = require("mysql2/promise");
const FormData = require("form-data");
const db_config = require("../config/db_config.json");

// Multer 설정: 이미지 파일 업로드 처리
const upload = multer();

// YOLOv8 Flask API URL (ngrok URL)
const YOLO_API_URL = "http://localhost:5000/detect"; // Flask 앱이 로컬에서 실행된다고 가정

// MySQL 연결 설정
const pool = mysql.createPool(db_config);

// YOLO 탐지 API
router.post("/yolo/detect", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;

    // 이미지 파일 유효성 검사
    if (!file) {
      console.error("이미지가 업로드되지 않았습니다.");
      return res.status(400).json({ error: "이미지가 업로드되지 않았습니다." });
    }

    console.log("이미지 업로드 성공:", file.originalname);

    // FormData 생성
    const formData = new FormData();
    formData.append("image", file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    // Flask YOLOv8 API로 이미지 전송
    const response = await axios.post(YOLO_API_URL, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    const yoloData = response.data;

    // YOLO API 응답 검사
    if (!yoloData || !yoloData.detections || yoloData.detections.length === 0) {
      console.log("탐지된 물품 없음");
      return res.json({ message: "탐지된 물품 없음", detections: [] });
    }

    console.log("YOLO 탐지 결과:", yoloData.detections);

    // 탐지 결과 반환
    res.json(yoloData);
  } catch (error) {
    console.error("YOLO API 요청 실패:", error.message);

    // 에러 메시지 반환
    if (error.response) {
      console.error("YOLO API 에러 응답:", error.response.data);
      return res.status(error.response.status).json(error.response.data);
    }

    res.status(500).json({ error: "YOLO API 요청 중 오류가 발생했습니다." });
  }
});

// 캡처된 이미지를 저장하고 lostlist에 추가
router.post("/save-image", upload.single("image"), async (req, res) => {
  let connection;

  try {
    const file = req.file;
    const { name: detectedClassName } = req.body; // Flask 앱에서 전달한 클래스 이름

    if (!file) {
      return res.status(400).json({ error: "이미지가 업로드되지 않았습니다." });
    }

    // Sharp로 이미지 크기 조정
    const resizedImage = await sharp(file.buffer).resize(250, 250).toBuffer();

    // MySQL에 연결
    connection = await pool.getConnection();

    // 이미지 데이터 저장
    const insertImageQuery = `
      INSERT INTO testimage (name, image, created_at) 
      VALUES (?, ?, NOW())
    `;
    await connection.execute(insertImageQuery, [
      detectedClassName || "알 수 없음",
      resizedImage,
    ]);

    // lostlist에 데이터 추가
    const currentTime = new Date();

    const insertLostlistQuery = `
      INSERT INTO lostlist (name, place, StorageLocation, image, upload_date) 
      VALUES (?, ?, ?, ?, ?)
    `;
    await connection.execute(insertLostlistQuery, [
      detectedClassName || "알 수 없음",
      "인쇄실", // 실제 장소 정보로 변경 필요
      "인쇄실", // 실제 보관 장소로 변경 필요
      resizedImage,
      currentTime,
    ]);

    connection.release();

    res.json({ message: "이미지가 저장되고 lostlist에 추가되었습니다." });
  } catch (error) {
    console.error("이미지 저장 실패:", error.message);

    if (connection) connection.release();
    res.status(500).json({ error: "이미지 저장 중 오류가 발생했습니다." });
  }
});

// 저장된 이미지를 가져오는 API
router.get("/get-images", async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [rows] = await connection.execute(
      "SELECT image FROM testimage ORDER BY created_at DESC"
    );

    // Base64로 변환하여 반환
    const images = rows.map((row) => Buffer.from(row.image).toString("base64"));

    connection.release();

    res.json({ images });
  } catch (error) {
    console.error("이미지 가져오기 실패:", error.message);
    res.status(500).json({ error: "이미지 가져오기 실패" });
  }
});

// 게시판에 데이터 전송하는 엔드포인트 추가
router.post("/post-to-board", async (req, res) => {
  let connection;
  try {
    const itemData = req.body;

    // MySQL에 연결
    connection = await pool.getConnection();

    // lostlist 테이블에 데이터 삽입
    const insertLostlistQuery = `
      INSERT INTO lostlist (name, place, StorageLocation, isPosted, isClaimed, upload_date) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await connection.execute(insertLostlistQuery, [
      itemData.itemType || "알 수 없음",
      itemData.lostLocation || "알 수 없음",
      itemData.storageLocation || "알 수 없음",
      itemData.isPosted ? 1 : 0,
      itemData.isClaimed ? 1 : 0,
      itemData.lostTime || new Date(),
    ]);

    connection.release();

    res.status(200).json({ message: "게시 성공" });
  } catch (error) {
    console.error("게시 실패:", error.message);

    if (connection) connection.release();
    res.status(500).json({ error: "게시 중 오류가 발생했습니다." });
  }
});

module.exports = router;
