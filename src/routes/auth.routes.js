const express = require('express');
const { register, login, getMe } = require('../controllers/auth.controller');
const { registerValidation, loginValidation } = require('../validators/auth.validator');
const validate = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { authRateLimiter } = require('../middlewares/rateLimiter.middleware');

const router = express.Router();

router.post('/register', authRateLimiter, validate(registerValidation), register);
router.post('/login', authRateLimiter, validate(loginValidation), login);
router.get('/me', authenticate, getMe);

module.exports = router;
