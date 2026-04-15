const Task = require('../models/Task');
const Project = require('../models/Project');

/** Verify the project exists and belongs to the logged-in user */
const verifyProjectOwnership = async (projectId, userId) => {
  return Project.findOne({ _id: projectId, createdBy: userId });
};

// POST /api/projects/:projectId/tasks
const createTask = async (req, res, next) => {
  try {
    const project = await verifyProjectOwnership(req.params.projectId, req.user._id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

    const { title, description, status, priority, dueDate } = req.body;
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      projectId: req.params.projectId,
    });

    res.status(201).json({ success: true, message: 'Task created.', data: { task } });
  } catch (err) {
    next(err);
  }
};

// GET /api/projects/:projectId/tasks
// Query params: page, limit, status
const getTasks = async (req, res, next) => {
  try {
    const project = await verifyProjectOwnership(req.params.projectId, req.user._id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { projectId: req.params.projectId };
    const validStatuses = ['todo', 'in-progress', 'completed'];
    if (req.query.status && validStatuses.includes(req.query.status)) {
      filter.status = req.query.status;
    }

    const [tasks, total] = await Promise.all([
      Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Task.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/projects/:projectId/tasks/:taskId
const getTask = async (req, res, next) => {
  try {
    const project = await verifyProjectOwnership(req.params.projectId, req.user._id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

    const task = await Task.findOne({ _id: req.params.taskId, projectId: req.params.projectId });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    res.json({ success: true, data: { task } });
  } catch (err) {
    next(err);
  }
};

// PUT /api/projects/:projectId/tasks/:taskId
const updateTask = async (req, res, next) => {
  try {
    const project = await verifyProjectOwnership(req.params.projectId, req.user._id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

    const allowedFields = ['title', 'description', 'status', 'priority', 'dueDate'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const task = await Task.findOneAndUpdate(
      { _id: req.params.taskId, projectId: req.params.projectId },
      updates,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    res.json({ success: true, message: 'Task updated.', data: { task } });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/projects/:projectId/tasks/:taskId
const deleteTask = async (req, res, next) => {
  try {
    const project = await verifyProjectOwnership(req.params.projectId, req.user._id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

    const task = await Task.findOneAndDelete({
      _id: req.params.taskId,
      projectId: req.params.projectId,
    });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    res.json({ success: true, message: 'Task deleted.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createTask, getTasks, getTask, updateTask, deleteTask };