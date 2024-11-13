const express = require('express');
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const db_config = require('./config/db_config.json');
const app = express();
const cors = require('cors');
const http = require('http'); // Added to use http server
const socketIo = require('socket.io'); // Added Socket.io

// Create HTTP server
const server = http.createServer(app); // Create server with Express
const io = socketIo(server); // Initialize Socket.io with the server

// MySQL 세션 스토어 설정
const sessionStoreOptions = {
  host: db_config.host,
  port: db_config.port,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
};

const sessionStore = new MySQLStore(sessionStoreOptions);

// CORS 설정
app.use(
  cors({
    origin: 'https://psgpark.duckdns.org', // Replace with your frontend URL
    methods: ['GET', 'POST'], // Allow specific methods
    credentials: true, // Allow cookies if needed
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 세션 미들웨어 설정
const sessionMiddleware = session({
  key: 'session_cookie_name',
  secret: 'dasdasd!@#@!#@skja1#@!$!ASDasd',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  unset: 'destroy',
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
  },
});

app.use(sessionMiddleware);

// 공유된 세션 설정 for Socket.io
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

// 정적 파일 제공
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.use(express.static(path.join(__dirname, 'public')));

// 라우터 설정
const loginRoutes = require('./user/login');
const signupRoutes = require('./user/signup');
const my_infoRoutes = require('./mainpage/my_info');
const updateRoutes = require('./user/update');
const checkLoginRoutes = require('./user/check-login');
const determine_exerciseRoutes = require('./determine_exercise/determine_badminton');
const makeroomRoutes = require('./socket/makeroom');
const roomcalledRoutes = require('./socket/roomcalled');

const matchInfoRoutes = require('./socket/matchInfo');
app.use('/loginpage', loginRoutes);
app.use('/signuppage', signupRoutes);
app.use('/', my_infoRoutes);
app.use('/', checkLoginRoutes);
app.use('/', determine_exerciseRoutes);
app.use('/match', makeroomRoutes);
app.use('/match', roomcalledRoutes);
app.use('/', matchInfoRoutes);

// 모든 다른 요청에 대해 프론트엔드로 리다이렉트
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Socket.io event handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Socket.io event handling 파일을 불러오기
const socketHandlers = require('./socket/socketHandlers'); // 새로운 파일을 불러옴
socketHandlers(io); // Socket.IO 객체를 전달하여 이벤트 처리 설정

// 서버 실행
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`);
});
