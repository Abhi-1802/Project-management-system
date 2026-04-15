const Project = require('../models/Project');
const Task = require('../models/Task');

// POST /api/projects
const createProject = async (req, res, next) => {
  try {
    const { projectName, description } = req.body;
    const project = await Project.create({ projectName, description, createdBy: req.user._id });
    res.status(201).json({ success: true, message: 'Project created.', data: { project } });
  } catch (err) {
    next(err);
  }
};

// GET /api/projects
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: { count: projects.length, projects } });
  } catch (err) {
    next(err);
  }
};

// GET /api/projects/:id
const getProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    res.json({ success: true, data: { project } });
  } catch (err) {
    next(err);
  }
};

// PUT /api/projects/:id
const updateProject = async (req, res, next) => {
  try {
    const { projectName, description } = req.body;
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { projectName, description },
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    res.json({ success: true, message: 'Project updated.', data: { project } });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/projects/:id
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

    // Cascade-delete all tasks belonging to this project
    await Task.deleteMany({ projectId: req.params.id });

    res.json({ success: true, message: 'Project and its tasks deleted.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createProject, getProjects, getProject, updateProject, deleteProject };