const express = require('express');
const { body } = require('express-validator');
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router({ mergeParams: true }); // inherit :projectId

router.use(protect);

const taskCreateValidation = [
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('description').optional().trim(),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'completed'])
    .withMessage('Status must be todo, in-progress, or completed'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('dueDate').optional().isISO8601().withMessage('dueDate must be a valid ISO 8601 date'),
];

const taskUpdateValidation = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().trim(),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'completed'])
    .withMessage('Status must be todo, in-progress, or completed'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('dueDate').optional().isISO8601().withMessage('dueDate must be a valid ISO 8601 date'),
];

router.route('/').get(getTasks).post(taskCreateValidation, validate, createTask);

router
  .route('/:taskId')
  .get(getTask)
  .put(taskUpdateValidation, validate, updateTask)
  .delete(deleteTask);

module.exports = router;