const express = require("express");
const router = express.Router();

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("세션 종료 중 오류 발생:", err);
      return res.status(500).send("로그아웃 중 오류가 발생했습니다.");
    }

    // 세션 쿠키를 삭제합니다
    res.clearCookie("session_cookie_name", {
      path: "/",
      httpOnly: true,
      secure: false, // https 환경에서는 true로 설정
    });

    return res.status(200).send("로그아웃이 완료되었습니다.");
  });
});

module.exports = router;
