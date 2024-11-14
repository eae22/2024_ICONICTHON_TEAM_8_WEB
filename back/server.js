const express = require("express");
const path = require("path");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const db_config = require("./config/db_config.json");
const app = express();
const cors = require("cors");

const sessionStoreOptions = {
  host: db_config.host,
  port: db_config.port,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
  charset: "utf8mb4", // 여기서 utf8mb4 설정
};

const sessionStore = new MySQLStore(sessionStoreOptions);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const sessionMiddleware = session({
  key: "session_cookie_name",
  secret: "sakdlakdjaslkdjsaldk",
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  unset: "destroy",
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // 배포 환경에서는 true
    maxAge: 1000 * 60 * 60 * 24, // 1일
  },
});

app.use(sessionMiddleware);

// 정적 파일 제공
app.use(express.static(path.join(__dirname, "../front/build")));
app.use(express.static(path.join(__dirname, "public")));

//라우팅
const yoloRoutes = require("./cctv/yolo"); // YOLO 라우터 추가

// 기존 라우터들
const mypageRoutes = require("./user/mypage");
const loginRoutes = require("./user/login");
const logoutRoutes = require("./user/logout");
const logincheckRoutes = require("./user/check-login");
const lostlistRoutes = require("./lostpost/lostlist");
const lostdetailRoutes = require("./lostpost/lostdetail");
const requestRoutes = require("./lostpost/request");

// YOLO 라우터 추가
app.use("/", mypageRoutes);
app.use("/", loginRoutes);
app.use("/", logincheckRoutes);
app.use("/", logoutRoutes);
app.use("/", yoloRoutes);
app.use("/", lostlistRoutes);
app.use("/", lostdetailRoutes);
app.use("/", requestRoutes);

//프론트 연결
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../front/build", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`);
});
