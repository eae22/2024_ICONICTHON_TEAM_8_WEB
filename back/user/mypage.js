const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const db_config = require("../config/db_config.json");
const sharp = require("sharp");

// Database connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
  port: db_config.port,
  charset: "utf8mb4",
  debug: false,
});

// 사용자 정보와 리사이즈된 이미지 반환
router.get("/information", (req, res) => {
  if (req.session && req.session.user) {
    const StudentID = req.session.user.id;

    pool.query(
      "SELECT * FROM users WHERE StudentID = ?",
      [StudentID],
      (error, results) => {
        if (error) {
          console.error("Database query failed:", error);
          return res.status(500).json({ error: "Database query failed" });
        }

        if (results.length > 0) {
          const user = results[0];

          if (user.userImage) {
            // 이미지를 리사이즈
            sharp(user.userImage)
              .resize(130, 130) // 130x130 크기로 리사이즈
              .toBuffer()
              .then((resizedImage) => {
                const base64Image = `data:image/png;base64,${Buffer.from(
                  resizedImage
                ).toString("base64")}`;

                res.status(200).json({
                  id: user.StudentID,
                  name: user.name,
                  major: user.major,
                  state: user.state,
                  userImage: base64Image, // 리사이즈된 Base64 이미지 데이터
                });
              })
              .catch((err) => {
                console.error("Image resizing failed:", err);
                res.status(500).json({ error: "Image processing failed" });
              });
          } else {
            // 이미지가 없을 경우
            res.status(200).json({
              id: user.StudentID,
              name: user.name,
              major: user.major,
              state: user.state,
              userImage: null,
            });
          }
        } else {
          res.status(404).json({ error: "User not found" });
        }
      }
    );
  } else {
    res.status(401).json({ error: "User not authenticated" });
  }
});

// 개인 물품 수취 목록 반환 (Base64 이미지 포함)

router.get("/personal-get-list", (req, res) => {
  const studentID = req.session.user?.id;

  if (!studentID) {
    return res.status(401).json({ error: "로그인 후 다시 시도해주세요." });
  }

  const query = `SELECT * FROM pickup_requests WHERE studentID = ?`;

  pool.query(query, [studentID], (error, results) => {
    if (error) {
      console.error("수취 목록 조회 중 오류 발생:", error);
      return res
        .status(500)
        .json({ error: "수취 목록 조회 중 오류가 발생했습니다." });
    }

    const data = results.map((item) => ({
      id: item.no,
      itemImage: item.image
        ? `data:image/png;base64,${Buffer.from(item.image).toString("base64")}`
        : null,
      itemType: item.itemType,
      lostTime: item.pickupDate,
      lostLocation: item.lostLocation,
    }));

    res.status(200).json(data);
  });
});

module.exports = router;
