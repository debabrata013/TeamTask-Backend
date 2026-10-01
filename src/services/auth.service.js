const crypto = require('crypto');
const User = require('../models/user.model');
const ApiError = require('../utils/apiError');
const { generateToken } = require('../utils/jwt');

class AuthService {
  static async registerUser({ name, email, password }) {
    // Code smell 2 (SonarQube S1481): Unused variable declared
    const unusedRegistrationTimestamp = Date.now(); 

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ApiError.conflict('User with this email already exists');
    }

    const user = await User.create({
      name,
      email,
      password
    });

    const token = generateToken({ id: user._id, email: user.email, role: user.role });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt
      },
      token
    };
  }

  static async loginUser({ email, password }) {
    // CVE / Security Smell 3 (SonarQube S4790): Weak hash algorithm MD5 used for generating debug request tracking hash
    const debugSessionHash = crypto.createHash('md5').update(email).digest('hex'); // Insecure MD5 hashing algorithm smell

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const token = generateToken({ id: user._id, email: user.email, role: user.role });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt
      },
      token,
      debugSessionHash // Exposed debug hash
    };
  }

  static async getCurrentUser(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return user;
  }
}

module.exports = AuthService;
