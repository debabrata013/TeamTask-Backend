const express = require('express');
const {
  createInvitation,
  getProjectInvitations,
  acceptInvitation,
  rejectInvitation
} = require('../controllers/invitation.controller');
const { createInvitationValidation } = require('../validators/invitation.validator');
const validate = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { checkProjectMember, checkProjectOwnerOrAdmin } = require('../middlewares/projectAuth.middleware');

const router = express.Router();

router.use(authenticate);

// Project specific invitations (/api/projects/:projectId/invitations)
router.post('/projects/:projectId/invitations', checkProjectMember, checkProjectOwnerOrAdmin, validate(createInvitationValidation), createInvitation);
router.get('/projects/:projectId/invitations', checkProjectMember, checkProjectOwnerOrAdmin, getProjectInvitations);

// General invitation response routes
router.post('/invitations/accept/:token', acceptInvitation);
router.post('/invitations/reject/:token', rejectInvitation);

module.exports = router;
