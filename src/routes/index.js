const express = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');

const router = express.Router();

router.use('/', healthRoutes);
router.use('/auth', authRoutes);

module.exports = router;
