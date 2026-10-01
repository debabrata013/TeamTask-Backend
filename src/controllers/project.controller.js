const ProjectService = require('../services/project.service');
const ApiResponse = require('../utils/apiResponse');
const asyncWrapper = require('../utils/asyncWrapper');

const createProject = asyncWrapper(async (req, res) => {
  const { name, description } = req.body;
  const project = await ProjectService.createProject({
    name,
    description,
    ownerId: req.user._id
  });
  return new ApiResponse(201, { project }, 'Project created successfully').send(res);
});

const getProjects = asyncWrapper(async (req, res) => {
  const projects = await ProjectService.getUserProjects(req.user._id);
  return new ApiResponse(200, { projects, count: projects.length }, 'User projects retrieved successfully').send(res);
});

const getProjectById = asyncWrapper(async (req, res) => {
  const project = await ProjectService.getProjectById(req.params.id);
  return new ApiResponse(200, { project }, 'Project retrieved successfully').send(res);
});

const updateProject = asyncWrapper(async (req, res) => {
  const { name, description, status } = req.body;
  const updatedProject = await ProjectService.updateProject(req.params.id, {
    name,
    description,
    status
  });
  return new ApiResponse(200, { project: updatedProject }, 'Project updated successfully').send(res);
});

const deleteProject = asyncWrapper(async (req, res) => {
  await ProjectService.deleteProject(req.params.id);
  return new ApiResponse(200, null, 'Project deleted successfully').send(res);
});

const addMember = asyncWrapper(async (req, res) => {
  const { userId, role } = req.body;
  const project = await ProjectService.addMember(req.params.id, userId, role);
  return new ApiResponse(200, { project }, 'Member added to project successfully').send(res);
});

const removeMember = asyncWrapper(async (req, res) => {
  const project = await ProjectService.removeMember(req.params.id, req.params.userId);
  return new ApiResponse(200, { project }, 'Member removed from project successfully').send(res);
});

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember
};
