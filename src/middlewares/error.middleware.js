const ApiError = require('../utils/apiError');
const env = require('../config/env');

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Handle Mongoose / Mongo specific errors
  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal Server Error';
    let errors = [];

    // Mongoose duplicate key error (11000)
    if (error.code === 11000) {
      statusCode = 409;
      const field = Object.keys(error.keyValue || {})[0] || 'field';
      message = `Duplicate value entered for '${field}' field.`;
    }

    // Mongoose ValidationError
    if (error.name === 'ValidationError') {
      statusCode = 400;
      message = 'Validation Error';
      errors = Object.values(error.errors).map((el) => ({
        field: el.path,
        message: el.message
      }));
    }

    // Mongoose CastError (e.g. invalid ObjectId)
    if (error.name === 'CastError') {
      statusCode = 400;
      message = `Invalid ${error.path}: ${error.value}`;
    }

    // JWT Errors
    if (error.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid authentication token';
    }
    if (error.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Authentication token expired';
    }

    error = new ApiError(statusCode, message, errors, err.stack);
  }

  const response = {
    success: false,
    message: error.message,
    ...(error.errors && error.errors.length > 0 && { errors: error.errors }),
    ...(env.NODE_ENV === 'development' && { stack: error.stack })
  };

  return res.status(error.statusCode).json(response);
};

module.exports = errorHandler;
