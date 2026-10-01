const { validationResult } = require('express-validator');
const ApiError = require('../utils/apiError');

const validate = (validations) => {
  return async (req, res, next) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg
    }));

    return next(ApiError.badRequest('Validation Failed', extractedErrors));
  };
};

module.exports = validate;
