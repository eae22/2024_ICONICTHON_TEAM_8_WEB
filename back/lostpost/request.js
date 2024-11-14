const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const db_config = require("../config/db_config.json");
const multer = require("multer");

// Database connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
  port: db_config.port,
  charset: "utf8mb4", // utf8mb4 설정
  debug: false,
});

// multer 설정: 파일 업로드를 메모리로 처리 (파일 크기에 맞는 설정 필요)
const upload = multer({ storage: multer.memoryStorage() });

// 수취 신청 API 수정
router.post("/pickup-request", (req, res) => {
  // Destructuring of req.body inside the POST request handler
  const {
    itemId, // Get 'itemId' from the request body
    itemType,
    storageLocation,
    lostTime,
    lostLocation,
    pickupDate,
    pickupTime,
  } = req.body;

  const studentID = req.session.user?.id;

  if (!studentID) {
    return res
      .status(400)
      .json({ error: "학번이 세션에 없습니다. 로그인 후 다시 시도해주세요." });
  }

  if (
    !itemId ||
    !itemType ||
    !pickupDate ||
    !pickupTime ||
    !storageLocation ||
    !lostLocation
  ) {
    return res.status(400).json({ error: "모든 필드를 작성해 주세요." });
  }

  // Fetch the image from 'lostlist' table using 'itemId'
  const getImageQuery = "SELECT image FROM lostlist WHERE no = ?";

  pool.query(getImageQuery, [itemId], (err, results) => {
    if (err) {
      console.error("Error fetching image:", err);
      return res
        .status(500)
        .json({ error: "이미지 조회 중 오류가 발생했습니다." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "해당 분실물을 찾을 수 없습니다." });
    }

    const image = results[0].image;

    // Format 'lostTime' for MySQL
    const formattedLostTime = new Date(lostTime)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // Insert pickup request data into 'pickup_requests' table
    const query = `
      INSERT INTO pickup_requests 
      (itemType, storageLocation, lostTime, lostLocation, pickupDate, pickupTime, studentID, image) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    pool.query(
      query,
      [
        itemType,
        storageLocation,
        formattedLostTime,
        lostLocation,
        pickupDate,
        pickupTime,
        studentID,
        image,
      ],
      (error, results) => {
        if (error) {
          console.error("Error inserting pickup request:", error);
          return res
            .status(500)
            .json({ error: "수취 신청 중 오류가 발생했습니다." });
        }

        res
          .status(200)
          .json({ message: "수취 신청이 성공적으로 제출되었습니다." });
      }
    );
  });
});

// Lost item detail API by ID
router.get("/lost-item-detail/:id", (req, res) => {
  const itemId = req.params.id;

  pool.query(
    "SELECT * FROM lostlist WHERE no = ?",
    [itemId],
    (error, results) => {
      if (error) {
        console.error("Database query failed:", error);
        return res.status(500).json({ error: "Database query failed" });
      }

      if (results.length > 0) {
        const item = results[0];

        const base64Image = item.image
          ? `data:image/png;base64,${Buffer.from(item.image).toString(
              "base64"
            )}`
          : null;

        const responseData = {
          id: item.no,
          itemType: item.name,
          lostTime: item.upload_date,
          lostLocation: item.place,
          storageLocation: item.StorageLocation || "위치 정보 없음",
          itemImage: base64Image,
        };

        res.status(200).json(responseData);
      } else {
        res.status(404).json({ error: "Item not found" });
      }
    }
  );
});

// 수취 신청 상태 업데이트 API
router.put("/pickup-request/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const query = "UPDATE pickup_requests SET status = ? WHERE id = ?";

  pool.query(query, [status, id], (error, results) => {
    if (error) {
      console.error("수취 신청 상태 업데이트 중 오류 발생:", error);
      return res
        .status(500)
        .json({ error: "수취 신청 상태 업데이트 중 오류가 발생했습니다." });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "수취 신청을 찾을 수 없습니다." });
    }

    res.status(200).json({ message: "수취 신청 상태가 업데이트되었습니다." });
  });
});

module.exports = router;
