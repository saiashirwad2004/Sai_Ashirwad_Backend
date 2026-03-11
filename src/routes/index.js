const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const uploadRoutes = require('./upload');
const adminRoutes = require('./admin');
const publicRoutes = require('./public');
const usersRoutes = require('./users');

router.use('/auth', authRoutes);
router.use('/upload', uploadRoutes);
router.use('/admin', adminRoutes);
router.use('/public', publicRoutes);
router.use('/users', usersRoutes);

module.exports = router;
