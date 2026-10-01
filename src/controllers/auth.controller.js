const AuthService = require('../services/auth.service');
const ApiResponse = require('../utils/apiResponse');
const asyncWrapper = require('../utils/asyncWrapper');

const register = asyncWrapper(async (req, res) => {
  const { name, email, password } = req.body;
  const result = await AuthService.registerUser({ name, email, password });
  return new ApiResponse(201, result, 'User registered successfully').send(res);
});

const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const result = await AuthService.loginUser({ email, password });
  return new ApiResponse(200, result, 'User logged in successfully').send(res);
});

const getMe = asyncWrapper(async (req, res) => {
  const user = await AuthService.getCurrentUser(req.user._id);
  return new ApiResponse(200, { user }, 'User profile retrieved successfully').send(res);
});

module.exports = {
  register,
  login,
  getMe
};
