const express = require('express');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember
} = require('../controllers/project.controller');
const {
  createProjectValidation,
  updateProjectValidation,
  addMemberValidation
} = require('../validators/project.validator');
const validate = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const {
  checkProjectMember,
  checkProjectOwnerOrAdmin,
  checkProjectOwnerOnly
} = require('../middlewares/projectAuth.middleware');

const router = express.Router();

// Apply authentication to all project endpoints
router.use(authenticate);

router.post('/', validate(createProjectValidation), createProject);
router.get('/', getProjects);

router.get('/:id', checkProjectMember, getProjectById);
router.put('/:id', checkProjectMember, checkProjectOwnerOrAdmin, validate(updateProjectValidation), updateProject);
router.delete('/:id', checkProjectMember, checkProjectOwnerOnly, deleteProject);

// Project member management
router.post('/:id/members', checkProjectMember, checkProjectOwnerOrAdmin, validate(addMemberValidation), addMember);
router.delete('/:id/members/:userId', checkProjectMember, checkProjectOwnerOrAdmin, removeMember);

module.exports = router;
