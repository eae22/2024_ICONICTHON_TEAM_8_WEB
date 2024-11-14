const express = require("express");
const router = express.Router();

router.get("/check-login", (req, res) => {
  console.log("/check-login 호출됨");
  if (req.session.user) {
    console.log("로그인 상태 확인됨");
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    console.log("로그인 상태 아님");
    res.json({ loggedIn: false });
  }
});

module.exports = router;
