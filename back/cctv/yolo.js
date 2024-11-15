const express = require("express");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");
const mysql = require("mysql2/promise");
const FormData = require("form-data");
const dbConfig = require("../config/db_config.json"); // JSON 파일에서 MySQL 설정 가져오기

// Multer 설정: 이미지 파일 업로드 처리
const upload = multer();

// YOLOv8 Colab API URL (ngrok URL)
const YOLO_API_URL = "https://d1a0-34-139-116-187.ngrok-free.app/detect"; // Flask 서버의 ngrok URL로 변경

// YOLO 탐지 API
app.post("/upload-video", upload.single("video"), async (req, res) => {
  const videoPath = req.file.path;

  try {
    // YOLO Flask API 호출
    const formData = new FormData();
    formData.append("video", fs.createReadStream(videoPath));

    const yoloResponse = await axios.post(YOLO_API_URL, formData, {
      headers: formData.getHeaders(),
    });

    const detections = yoloResponse.data.detections;

    // 탐지 결과를 데이터베이스에 저장
    const dbConnection = await mysql.createConnection(dbConfig);
    const insertQuery = `
      INSERT INTO lostlist (name, place, StorageLocation, image, upload_date) 
      VALUES (?, ?, ?, ?, NOW())
    `;

    for (const detection of detections) {
      const { name, image } = detection;

      // 탐지된 객체의 한글 이름 설정
      const translatedName =
        name === "card" ? "카드" : name === "wallets" ? "지갑" : name;

      // 데이터베이스에 저장
      await dbConnection.execute(insertQuery, [
        translatedName,
        "신공학관", // 장소 고정
        "미정", // 보관 장소 미정으로 설정
        Buffer.from(image, "base64"), // Flask에서 Base64 이미지 전달받음
      ]);
    }

    await dbConnection.end();

    res.json({ status: "success", captured_count: detections.length });
  } catch (error) {
    console.error("Error processing video:", error.message);
    res.status(500).json({ error: "Failed to process video" });
  } finally {
    // 업로드된 비디오 삭제
    fs.unlinkSync(videoPath);
  }
});

module.exports = router;
