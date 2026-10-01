const TaskService = require('../services/task.service');
const ApiResponse = require('../utils/apiResponse');
const asyncWrapper = require('../utils/asyncWrapper');

const createTask = asyncWrapper(async (req, res) => {
  const { title, description, assignedTo, priority, status, dueDate } = req.body;
  const projectId = req.params.projectId || req.body.projectId;

  const task = await TaskService.createTask({
    title,
    description,
    projectId,
    assignedTo,
    createdById: req.user._id,
    priority,
    status,
    dueDate
  });

  return new ApiResponse(201, { task }, 'Task created successfully').send(res);
});

const getProjectTasks = asyncWrapper(async (req, res) => {
  const projectId = req.params.projectId;
  const { status, priority, assignedTo, search } = req.query;

  const tasks = await TaskService.getProjectTasks(projectId, {
    status,
    priority,
    assignedTo,
    search
  });

  return new ApiResponse(200, { tasks, count: tasks.length }, 'Project tasks retrieved successfully').send(res);
});

const getTaskById = asyncWrapper(async (req, res) => {
  const task = await TaskService.getTaskById(req.params.id);

  // Authorization check: Verify user is a member of the project task belongs to
  const project = task.project;
  const userIdStr = req.user._id.toString();
  const isOwner = project.owner.toString() === userIdStr;
  const isMember = project.members.some((m) => m.user.toString() === userIdStr);

  if (!isOwner && !isMember) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to view this task'
    });
  }

  return new ApiResponse(200, { task }, 'Task retrieved successfully').send(res);
});

const updateTask = asyncWrapper(async (req, res) => {
  const { title, description, assignedTo, priority, status, dueDate } = req.body;
  const updatedTask = await TaskService.updateTask(req.params.id, {
    title,
    description,
    assignedTo,
    priority,
    status,
    dueDate
  });

  return new ApiResponse(200, { task: updatedTask }, 'Task updated successfully').send(res);
});

const deleteTask = asyncWrapper(async (req, res) => {
  await TaskService.deleteTask(req.params.id);
  return new ApiResponse(200, null, 'Task deleted successfully').send(res);
});

module.exports = {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask
};
