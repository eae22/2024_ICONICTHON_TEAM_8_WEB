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

// 사용자 정보 조회 API
router.get("/information", (req, res) => {
  // 세션에 사용자 정보가 있는지 확인
  if (req.session && req.session.user) {
    const StudentID = req.session.user.id; // 세션에서 학번 가져오기

    // MySQL 쿼리 실행
    pool.query(
      "SELECT StudentID, Name, Major, State FROM users WHERE StudentID = ?",
      [StudentID],
      (error, results) => {
        if (error) {
          console.error("Database query failed:", error);
          return res.status(500).json({ error: "Database query failed" });
        }

        if (results.length > 0) {
          const user = results[0];
          res.status(200).json({
            id: user.StudentID,
            name: user.Name,
            major: user.Major,
            state: user.State,
          });
        } else {
          res.status(404).json({ error: "User not found" });
        }
      }
    );
  } else {
    res.status(401).json({ error: "User not authenticated" });
  }
});

module.exports = router;
