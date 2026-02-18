const express = require('express');
const router  = express.Router();

const controller = require('./request.controller');
const authenticate = require('../shared/middleware/authenticate.middleware');
const authorize    = require('../shared/middleware/authorizePermission.middleware');
const validate     = require('../shared/middleware/validate.middleware');
const {
  createRequestSchema,
  updateRequestSchema
} = require('./request.validator');

router.post(
  '/',
  authenticate,
  authorize('requests_create'),
  validate(createRequestSchema),
  controller.create
);

router.get(
  '/',
  authenticate,
  authorize('requests_read_all'),
  controller.getAll
);

router.get(
  '/mine',
  authenticate,
  authorize('requests_read'),
  controller.getMine
);

router.get(
  '/:id',
  authenticate,
  authorize('requests_read'),
  controller.getOne
);

router.get(
  '/:id/history',
  authenticate,
  authorize('requests_read'),
  controller.getHistory
);

router.put(
  '/:id',
  authenticate,
  authorize('requests_update'),
  validate(updateRequestSchema),
  controller.update
);

router.delete(
  '/:id',
  authenticate,
  authorize('requests_delete'),
  controller.remove
);

module.exports = router;