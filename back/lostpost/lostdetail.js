const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const db_config = require("../config/db_config.json");

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

// 분실물 상세 정보 API (id를 기준으로 데이터 가져오기)
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

        // Base64로 이미지 변환
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
          itemImage: base64Image, // Base64 이미지 추가
        };

        res.status(200).json(responseData);
      } else {
        res.status(404).json({ error: "Item not found" });
      }
    }
  );
});

module.exports = router;
