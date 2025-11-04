// 환경변수 로드 (로컬 개발 환경용)
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const todoRoutes = require('./Routers/todoRoutes');

const app = express();
const port = process.env.PORT || 5000;

// CORS 미들웨어
app.use(cors());

// JSON 파싱 미들웨어
app.use(express.json());

// 헬스 체크 엔드포인트
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Todo backend is running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// MongoDB 연결
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('❌ 오류: MONGODB_URI 환경변수가 설정되지 않았습니다!');
  console.error('Render.com 대시보드에서 Environment Variables를 설정해주세요.');
  process.exit(1);
}

console.log('MongoDB 연결 시도 중...');

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('✅ MongoDB 연결 성공');
    
    // MongoDB 연결 성공 후에만 서버 시작
    app.listen(port, () => {
      console.log(`🚀 Server is listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB 연결 실패:', err.message);
    console.error('MongoDB URI를 확인하고 데이터베이스가 접근 가능한지 확인해주세요.');
    process.exit(1);
  });

// Todo 라우터
app.use('/api/todos', todoRoutes);

