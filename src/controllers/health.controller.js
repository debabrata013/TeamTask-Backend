const mongoose = require('mongoose');
const ApiResponse = require('../utils/apiResponse');
const asyncWrapper = require('../utils/asyncWrapper');

const checkHealth = asyncWrapper(async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const healthData = {
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus
  };

  return new ApiResponse(200, healthData, 'TeamTask API is running smoothly').send(res);
});

module.exports = {
  checkHealth
};
