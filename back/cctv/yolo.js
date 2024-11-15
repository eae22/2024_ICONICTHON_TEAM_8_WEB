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
const YOLO_API_URL = "https://3fcd-34-90-255-102.ngrok-free.app/upload-video"; // Flask 서버의 ngrok URL로 변경

// YOLO 탐지 API
router.post("/upload-video", upload.single("video"), async (req, res) => {
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

      // Translate class names to Korean
      const translatedName =
        name === "card" ? "카드" : name === "wallets" ? "지갑" : name;

      await dbConnection.execute(insertQuery, [
        translatedName,
        "신공학관", // 장소 고정
        "미정", // 보관 장소 미정으로 설정
        Buffer.from(image, "base64"),
      ]);
    }

    await dbConnection.end();
    res.json({ status: "success", captured_count: detections.length });
  } catch (error) {
    console.error("Error processing video:", error.message);
    res.status(500).json({ error: "Failed to process video" });
  } finally {
    fs.unlinkSync(videoPath);
  }
});
module.exports = router;
