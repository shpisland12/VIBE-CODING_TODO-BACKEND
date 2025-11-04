const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, '할일 제목을 입력해주세요.'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
  }
);

module.exports = todoSchema;

