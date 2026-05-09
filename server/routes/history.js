const express = require('express');
const router = express.Router();
const { getAllProjects, getProjectById } = require('../services/dbService');

// GET /api/history
router.get('/', (req, res, next) => {
  try {
    const projects = getAllProjects();
    res.json({ success: true, data: projects, count: projects.length });
  } catch (err) {
    next(err);
  }
});

// GET /api/history/:id
router.get('/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const project = getProjectById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
