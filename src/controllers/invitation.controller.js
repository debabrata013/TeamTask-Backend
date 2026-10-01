const InvitationService = require('../services/invitation.service');
const ApiResponse = require('../utils/apiResponse');
const asyncWrapper = require('../utils/asyncWrapper');

const createInvitation = asyncWrapper(async (req, res) => {
  const { email, role } = req.body;
  const projectId = req.params.projectId;

  const invitation = await InvitationService.createInvitation({
    projectId,
    email,
    role,
    inviterId: req.user._id
  });

  return new ApiResponse(201, { invitation }, 'Invitation created successfully').send(res);
});

const getProjectInvitations = asyncWrapper(async (req, res) => {
  const invitations = await InvitationService.getProjectInvitations(req.params.projectId);
  return new ApiResponse(200, { invitations }, 'Project invitations retrieved successfully').send(res);
});

const acceptInvitation = asyncWrapper(async (req, res) => {
  const result = await InvitationService.acceptInvitation(req.params.token, req.user._id);
  return new ApiResponse(200, result, 'Invitation accepted successfully').send(res);
});

const rejectInvitation = asyncWrapper(async (req, res) => {
  const invitation = await InvitationService.rejectInvitation(req.params.token);
  return new ApiResponse(200, { invitation }, 'Invitation rejected successfully').send(res);
});

module.exports = {
  createInvitation,
  getProjectInvitations,
  acceptInvitation,
  rejectInvitation
};
