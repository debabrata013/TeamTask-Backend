const express = require('express');
const {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask
} = require('../controllers/task.controller');
const { createTaskValidation, updateTaskValidation } = require('../validators/task.validator');
const validate = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { checkProjectMember, checkProjectOwnerOrAdmin } = require('../middlewares/projectAuth.middleware');

// Create router with mergeParams: true to inherit :projectId from parent route
const router = express.Router({ mergeParams: true });

router.use(authenticate);

// Routes scoped under /api/projects/:projectId/tasks
router.post('/projects/:projectId/tasks', checkProjectMember, validate(createTaskValidation), createTask);
router.get('/projects/:projectId/tasks', checkProjectMember, getProjectTasks);

// Direct task routes by ID (/api/tasks/:id)
router.get('/tasks/:id', getTaskById);
router.put('/tasks/:id', validate(updateTaskValidation), updateTask);
router.delete('/tasks/:id', deleteTask);

module.exports = router;
