const Task = require('../models/task.model');
const Project = require('../models/project.model');
const ApiError = require('../utils/apiError');

class TaskService {
  static async createTask({ title, description, projectId, assignedTo, createdById, priority, status, dueDate }) {
    const project = await Project.findById(projectId);
    if (!project) {
      throw ApiError.notFound('Project not found');
    }

    // Verify assigned user is a member of the project if assigned
    if (assignedTo) {
      const isOwner = project.owner.toString() === assignedTo.toString();
      const isMember = project.members.some((m) => m.user.toString() === assignedTo.toString());
      if (!isOwner && !isMember) {
        throw ApiError.badRequest('Assigned user must be a member of the project');
      }
    }

    const task = await Task.create({
      title,
      description,
      project: projectId,
      assignedTo: assignedTo || null,
      createdBy: createdById,
      priority: priority || 'medium',
      status: status || 'todo',
      dueDate: dueDate || null
    });

    return await task.populate([
      { path: 'assignedTo', select: 'name email avatar' },
      { path: 'createdBy', select: 'name email avatar' },
      { path: 'project', select: 'name' }
    ]);
  }

  static async getProjectTasks(projectId, filters = {}) {
    const query = { project: projectId };

    if (filters.status) query.status = filters.status;
    if (filters.priority) query.priority = filters.priority;
    if (filters.assignedTo) query.assignedTo = filters.assignedTo;
    if (filters.search) {
      query.title = { $regex: filters.search, $options: 'i' };
    }

    return await Task.find(query)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort({ createdAt: -1 });
  }

  static async getTaskById(taskId) {
    const task = await Task.findById(taskId)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'name owner members');

    if (!task) {
      throw ApiError.notFound('Task not found');
    }
    return task;
  }

  static async updateTask(taskId, updateData) {
    const task = await Task.findById(taskId);
    if (!task) {
      throw ApiError.notFound('Task not found');
    }

    // If changing assignee, verify new assignee belongs to the project
    if (updateData.assignedTo) {
      const project = await Project.findById(task.project);
      if (project) {
        const isOwner = project.owner.toString() === updateData.assignedTo.toString();
        const isMember = project.members.some((m) => m.user.toString() === updateData.assignedTo.toString());
        if (!isOwner && !isMember) {
          throw ApiError.badRequest('Assigned user must be a member of the project');
        }
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'name');

    return updatedTask;
  }

  static async deleteTask(taskId) {
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) {
      throw ApiError.notFound('Task not found');
    }
    return task;
  }
}

module.exports = TaskService;
