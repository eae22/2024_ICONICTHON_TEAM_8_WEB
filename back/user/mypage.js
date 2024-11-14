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

const sharp = require("sharp");

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
            // Blob 데이터를 sharp으로 처리
            sharp(user.userImage)
              .resize(130, 130) // 130x130으로 리사이즈
              .toBuffer()
              .then((resizedImage) => {
                const base64Image = `data:image/png;base64,${Buffer.from(
                  resizedImage
                ).toString("base64")}`;

                res.status(200).json({
                  id: user.StudentID,
                  name: user.Name,
                  major: user.Major,
                  state: user.State,
                  userImage: base64Image, // 리사이즈된 Base64 이미지 데이터
                });
              })
              .catch((err) => {
                console.error("Image resizing failed:", err);
                res.status(500).json({ error: "Image processing failed" });
              });
          } else {
            res.status(200).json({
              id: user.StudentID,
              name: user.Name,
              major: user.Major,
              state: user.State,
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

router.get("/image/:StudentID", (req, res) => {
  const StudentID = req.params.StudentID;

  pool.query(
    "SELECT userImage FROM users WHERE StudentID = ?",
    [StudentID],
    (error, results) => {
      if (error) {
        console.error("Database query failed:", error);
        return res.status(500).send("Database query failed");
      }

      if (results.length > 0 && results[0].userImage) {
        const imageBuffer = results[0].userImage;

        // 이미지 크기 조정
        sharp(imageBuffer)
          .resize(130, 130) // 130x130 크기로 리사이징
          .toBuffer()
          .then((resizedImage) => {
            res.setHeader("Content-Type", "image/png");
            res.send(resizedImage);
          })
          .catch((err) => {
            console.error("Image resizing failed:", err);
            res.status(500).send("Image processing failed");
          });
      } else {
        res.status(404).send("Image not found");
      }
    }
  );
});

module.exports = router;
