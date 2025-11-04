const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// 할일 목록 조회
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: '할일 목록 조회 중 오류가 발생했습니다.', details: error.message });
  }
});

// 할일 생성
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: '할일 제목은 필수입니다.' });
    }

    const todo = new Todo({
      title,
      description: description || '',
    });

    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({ error: '할일 생성 중 오류가 발생했습니다.', details: error.message });
  }
});

// 할일 수정
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: '할일 제목은 필수입니다.' });
    }

    const todo = await Todo.findByIdAndUpdate(
      id,
      {
        title,
        description: description || '',
      },
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({ error: '할일을 찾을 수 없습니다.' });
    }

    res.status(200).json(todo);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: '유효하지 않은 ID입니다.' });
    }
    res.status(500).json({ error: '할일 수정 중 오류가 발생했습니다.', details: error.message });
  }
});

// 할일 삭제
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return res.status(404).json({ error: '할일을 찾을 수 없습니다.' });
    }

    res.status(200).json({ message: '할일이 삭제되었습니다.', todo });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: '유효하지 않은 ID입니다.' });
    }
    res.status(500).json({ error: '할일 삭제 중 오류가 발생했습니다.', details: error.message });
  }
});

module.exports = router;

