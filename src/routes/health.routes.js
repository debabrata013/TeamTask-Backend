const express = require('express');
const { checkHealth } = require('../controllers/health.controller');

const router = express.Router();

router.get('/health', checkHealth);

module.exports = router;
