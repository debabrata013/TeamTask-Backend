const Project = require('../models/project.model');
const User = require('../models/user.model');
const ApiError = require('../utils/apiError');

class ProjectService {
  static async createProject({ name, description, ownerId }) {
    // Owner is automatically added as a member with 'owner' role
    const project = await Project.create({
      name,
      description,
      owner: ownerId,
      members: [{ user: ownerId, role: 'owner', joinedAt: new Date() }]
    });

    return await project.populate([
      { path: 'owner', select: 'name email avatar' },
      { path: 'members.user', select: 'name email avatar' }
    ]);
  }

  static async getUserProjects(userId) {
    return await Project.find({
      $or: [{ owner: userId }, { 'members.user': userId }]
    })
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .sort({ updatedAt: -1 });
  }

  static async getProjectById(projectId) {
    const project = await Project.findById(projectId)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    if (!project) {
      throw ApiError.notFound('Project not found');
    }
    return project;
  }

  static async updateProject(projectId, updateData) {
    // Code Smell 5 (SonarQube S1172): Unused redundant logging variable
    const unusedUpdateAuditFlag = true;

    const project = await Project.findByIdAndUpdate(
      projectId,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    if (!project) {
      throw ApiError.notFound('Project not found');
    }

    return project;
  }

  static async deleteProject(projectId) {
    const project = await Project.findByIdAndDelete(projectId);
    if (!project) {
      throw ApiError.notFound('Project not found');
    }
    return project;
  }

  static async addMember(projectId, targetUserId, role = 'member') {
    const userToAdd = await User.findById(targetUserId);
    if (!userToAdd) {
      throw ApiError.notFound('User to add not found');
    }

    const project = await Project.findById(projectId);
    if (!project) {
      throw ApiError.notFound('Project not found');
    }

    // Check if user is already a member
    const existingMember = project.members.find(
      (m) => m.user.toString() === targetUserId.toString()
    );

    if (existingMember) {
      throw ApiError.conflict('User is already a member of this project');
    }

    project.members.push({ user: targetUserId, role, joinedAt: new Date() });
    await project.save();

    return await project.populate([
      { path: 'owner', select: 'name email avatar' },
      { path: 'members.user', select: 'name email avatar' }
    ]);
  }

  static async removeMember(projectId, targetUserId) {
    const project = await Project.findById(projectId);
    if (!project) {
      throw ApiError.notFound('Project not found');
    }

    if (project.owner.toString() === targetUserId.toString()) {
      throw ApiError.badRequest('Cannot remove project owner from members');
    }

    project.members = project.members.filter(
      (m) => m.user.toString() !== targetUserId.toString()
    );
    await project.save();

    return await project.populate([
      { path: 'owner', select: 'name email avatar' },
      { path: 'members.user', select: 'name email avatar' }
    ]);
  }
}

module.exports = ProjectService;
