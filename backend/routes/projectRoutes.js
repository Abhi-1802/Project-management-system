const express = require('express');
const { body } = require('express-validator');
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const taskRouter = require('./taskRoutes');

const router = express.Router();

// Merge params so taskRouter can access :projectId
router.use('/:projectId/tasks', taskRouter);

const projectValidation = [
  body('projectName').trim().notEmpty().withMessage('Project name is required'),
  body('description').optional().trim(),
];

router.use(protect); // all project routes require auth

router.route('/').get(getProjects).post(projectValidation, validate, createProject);

router
  .route('/:id')
  .get(getProject)
  .put(projectValidation, validate, updateProject)
  .delete(deleteProject);

module.exports = router;