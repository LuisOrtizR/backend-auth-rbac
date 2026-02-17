// routes/request.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/request.controller');
const authenticate = require('../middleware/authenticate.middleware');
const authorize = require('../middleware/authorizePermission.middleware');
const validate = require('../middleware/validate.middleware');
const { createRequestSchema, updateRequestSchema } = require('../validators/request.validator');

router.post('/', authenticate, authorize('requests_create'), validate(createRequestSchema), controller.create);
router.get('/', authenticate, authorize('requests_read.all'), controller.getAll); // Admin
router.get('/mine', authenticate, authorize('requests_read'), controller.getMine); // Propias
router.get('/:id', authenticate, authorize('requests_read'), controller.getOne);
router.put('/:id', authenticate, authorize('requests_update'), validate(updateRequestSchema), controller.update);
router.delete('/:id', authenticate, authorize('requests_delete'), controller.remove);

module.exports = router;
