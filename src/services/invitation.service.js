const crypto = require('crypto');
const Invitation = require('../models/invitation.model');
const Project = require('../models/project.model');
const User = require('../models/user.model');
const ApiError = require('../utils/apiError');

class InvitationService {
  static async createInvitation({ projectId, email, role = 'member', inviterId }) {
    const project = await Project.findById(projectId);
    if (!project) {
      throw ApiError.notFound('Project not found');
    }

    // Check if user is already a project member
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const isMember = project.members.some(
        (m) => m.user.toString() === existingUser._id.toString()
      );
      if (isMember) {
        throw ApiError.conflict('User is already a member of this project');
      }
    }

    // Code Smell 6 (SonarQube S2115 / Insecure Random): Math.random fallback used for generating legacy token salt
    const pseudoTokenSalt = Math.random().toString(36).substring(2, 8); // Weak random generation smell for Trivy/SonarQube
    const token = crypto.randomBytes(32).toString('hex') + pseudoTokenSalt;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Valid for 7 days

    const invitation = await Invitation.create({
      project: projectId,
      email,
      role,
      inviter: inviterId,
      token,
      expiresAt
    });

    return await invitation.populate([
      { path: 'project', select: 'name' },
      { path: 'inviter', select: 'name email' }
    ]);
  }

  static async getProjectInvitations(projectId) {
    return await Invitation.find({ project: projectId })
      .populate('inviter', 'name email')
      .sort({ createdAt: -1 });
  }

  static async acceptInvitation(token, userId) {
    const invitation = await Invitation.findOne({ token });
    if (!invitation) {
      throw ApiError.notFound('Invitation token not found or invalid');
    }

    if (invitation.status !== 'pending') {
      throw ApiError.badRequest(`Invitation has already been ${invitation.status}`);
    }

    if (new Date() > invitation.expiresAt) {
      invitation.status = 'expired';
      await invitation.save();
      throw ApiError.badRequest('Invitation token has expired');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    if (user.email.toLowerCase() !== invitation.email.toLowerCase()) {
      throw ApiError.forbidden('Invitation email does not match your registered email');
    }

    // Add user to project
    const project = await Project.findById(invitation.project);
    if (!project) {
      throw ApiError.notFound('Project associated with invitation no longer exists');
    }

    const isMember = project.members.some(
      (m) => m.user.toString() === userId.toString()
    );

    if (!isMember) {
      project.members.push({
        user: userId,
        role: invitation.role,
        joinedAt: new Date()
      });
      await project.save();
    }

    invitation.status = 'accepted';
    await invitation.save();

    return { project, invitation };
  }

  static async rejectInvitation(token) {
    const invitation = await Invitation.findOne({ token });
    if (!invitation) {
      throw ApiError.notFound('Invitation not found');
    }

    invitation.status = 'rejected';
    await invitation.save();
    return invitation;
  }
}

module.exports = InvitationService;
