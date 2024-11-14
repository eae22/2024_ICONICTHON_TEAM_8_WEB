// login.js - Router file
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const mysql = require("mysql");
const db_config = require("../config/db_config.json");

const pool = mysql.createPool({
  connectionLimit: 50,
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
  port: db_config.port,
  debug: false,
});

router.post("/process/login", (req, res) => {
  console.log("/login 호출됨", req.body);
  const studentID = req.body.id; // 학번
  const password = req.body.password; // 비밀번호

  console.log("로그인 요청 - 학번: ", studentID, ", 비밀번호: ", password);
  pool.getConnection((err, conn) => {
    if (err) {
      console.error("MySQL Connection Error", err);
      if (conn) conn.release();
      res.status(500).json({ success: false, message: "DB 서버 연결 실패" });
      return;
    }

    conn.query(
      "SELECT * FROM users WHERE StudentID = ?",
      [studentID],
      async (err, rows) => {
        conn.release();
        if (err) {
          console.error("Query Error", err);
          res.status(500).json({ success: false, message: "Query 실패" });
          return;
        }

        if (rows.length > 0) {
          const user = rows[0];
          const match = await bcrypt.compare(password, user.Password);

          if (match) {
            console.log(
              "로그인 성공 - 이름: [%s], 학번: [%s], 상태: [%s]",
              user.Name,
              user.StudentID,
              user.State
            );

            req.session.user = {
              id: user.StudentID,
              name: user.Name,
              major: user.Major,
              state: user.State,
              authorized: true,
            };

            res.json({ success: true, message: "로그인 성공" });
          } else {
            console.log("비밀번호 불일치");
            res.status(401).json({
              success: false,
              message: "비밀번호가 일치하지 않습니다.",
            });
          }
        } else {
          console.log("사용자를 찾을 수 없음");
          res.status(404).json({
            success: false,
            message: "학번 또는 비밀번호가 일치하지 않습니다.",
          });
        }
      }
    );
  });
});

module.exports = router;
