const express = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const projectRoutes = require('./project.routes');

const router = express.Router();

router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);

module.exports = router;
