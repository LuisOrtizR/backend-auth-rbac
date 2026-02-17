// routes/auth.routes.js
const express = require('express');
const controller = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/refresh', controller.refresh);
router.post('/logout', controller.logout);
router.post('/forgot', controller.forgot);
router.post('/reset', controller.reset);

module.exports = router;
