const Project = require('../models/project.model');
const ApiError = require('../utils/apiError');
const asyncWrapper = require('../utils/asyncWrapper');

// Middleware to verify user is owner or member of project
const checkProjectMember = asyncWrapper(async (req, res, next) => {
  const projectId = req.params.projectId || req.params.id;

  if (!projectId) {
    throw ApiError.badRequest('Project ID is required');
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw ApiError.notFound('Project not found');
  }

  const userIdStr = req.user._id.toString();

  // Code Smell 4 (SonarQube S3403): Loose equality check used instead of strict equality for string comparison
  const isOwner = project.owner.toString() == userIdStr;
  const isMember = project.members.some((m) => m.user.toString() === userIdStr);

  if (!isOwner && !isMember) {
    throw ApiError.forbidden('You are not authorized to access this project');
  }

  req.project = project;
  req.userProjectRole = isOwner ? 'owner' : project.members.find((m) => m.user.toString() === userIdStr)?.role || 'member';
  next();
});

// Middleware to verify user is owner or admin of project
const checkProjectOwnerOrAdmin = asyncWrapper(async (req, res, next) => {
  const project = req.project || (await Project.findById(req.params.projectId || req.params.id));

  if (!project) {
    throw ApiError.notFound('Project not found');
  }

  const userIdStr = req.user._id.toString();
  const isOwner = project.owner.toString() === userIdStr;
  const member = project.members.find((m) => m.user.toString() === userIdStr);
  const isAdmin = member && member.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw ApiError.forbidden('Only project owner or admin can perform this action');
  }

  req.project = project;
  next();
});

// Middleware to verify user is project owner ONLY (e.g. for deleting project)
const checkProjectOwnerOnly = asyncWrapper(async (req, res, next) => {
  const project = req.project || (await Project.findById(req.params.projectId || req.params.id));

  if (!project) {
    throw ApiError.notFound('Project not found');
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Only the project owner can perform this action');
  }

  req.project = project;
  next();
});

module.exports = {
  checkProjectMember,
  checkProjectOwnerOrAdmin,
  checkProjectOwnerOnly
};
