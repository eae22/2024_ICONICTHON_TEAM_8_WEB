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
// Express 백엔드 - 수취 신청 API 수정
router.post("/pickup-request", (req, res) => {
  const {
    itemType,
    storageLocation,
    lostTime,
    lostLocation,
    pickupDate,
    pickupTime,
  } = req.body;

  // 세션에서 학번 가져오기
  const studentID = req.session.user?.id;

  if (!studentID) {
    return res
      .status(400)
      .json({ error: "학번이 세션에 없습니다. 로그인 후 다시 시도해주세요." });
  }

  // lostTime을 MySQL 형식에 맞게 변환
  const formattedLostTime = new Date(lostTime)
    .toISOString()
    .slice(0, 19)
    .replace("T", " "); // '2024-11-14 06:10:56'

  // 유효성 검사 추가
  if (
    !itemType ||
    !pickupDate ||
    !pickupTime ||
    !storageLocation ||
    !lostLocation
  ) {
    return res.status(400).json({ error: "모든 필드를 작성해 주세요." });
  }

  // 수취 신청 데이터 삽입 쿼리
  const query = `
    INSERT INTO pickup_requests 
    (itemType, storageLocation, lostTime, lostLocation, pickupDate, pickupTime, studentID) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
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
      studentID, // 학번 추가
    ],
    (error, results) => {
      if (error) {
        console.error("수취 신청 중 오류 발생:", error);
        return res
          .status(500)
          .json({ error: "수취 신청 중 오류가 발생했습니다." });
      }

      // 수취 신청 성공
      res
        .status(200)
        .json({ message: "수취 신청이 성공적으로 제출되었습니다." });
    }
  );
});

// 수취 신청 상태 업데이트 API
router.put("/pickup-request/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // 수취 신청 상태 업데이트 쿼리
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

    // 수취 신청 상태 업데이트 성공
    res.status(200).json({ message: "수취 신청 상태가 업데이트되었습니다." });
  });
});

module.exports = router;
