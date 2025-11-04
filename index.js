// 환경변수 로드
const dotenv = require('dotenv');
const path = require('path');

// .env 파일 경로 명시적으로 지정
const result = dotenv.config({ path: path.join(__dirname, '.env') });

if (result.error) {
  console.error('dotenv 로드 실패:', result.error);
} else {
  console.log('dotenv 로드 성공');
}

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

// MongoDB 연결
console.log('환경변수 체크:');
console.log('- MONGODB_URI 존재 여부:', !!process.env.MONGODB_URI);
console.log('- MONGODB_URI 값:', process.env.MONGODB_URI);

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-app';
console.log('사용할 MongoDB URI:', mongoURI);

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('MongoDB 연결 성공');
  })
  .catch((err) => {
    console.error('MongoDB 연결 실패:', err);
  });

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Todo backend is running' });
});

// Todo 라우터
app.use('/api/todos', todoRoutes);

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});

