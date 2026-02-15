const express = require('express');

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const roleRoutes = require('./role.routes');
const permissionRoutes = require('./permission.routes');
const requestRoutes = require('./request.routes');

const router = express.Router();

/**
 * API ROUTES
 */
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);
router.use('/requests', requestRoutes);

module.exports = router;
