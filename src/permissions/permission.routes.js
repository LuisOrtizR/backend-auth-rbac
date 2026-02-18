const express = require('express');
const router = express.Router();

const controller = require('./permission.controller');
const authenticate = require('../shared/middleware/authenticate.middleware');
const authorize = require('../shared/middleware/authorizePermission.middleware');
const validate = require('../shared/middleware/validate.middleware');

const {
  createPermissionSchema,
  updatePermissionSchema,
  uuidParamSchema
} = require('./permission.validator');

router.post(
  '/',
  authenticate,
  authorize('permissions_create'),
  validate(createPermissionSchema),
  controller.create
);

router.get(
  '/',
  authenticate,
  authorize('permissions_read'),
  controller.getAll
);

router.get(
  '/:uuid',
  authenticate,
  authorize('permissions_read'),
  validate(uuidParamSchema, 'params'),
  controller.getByUuid
);

router.put(
  '/:uuid',
  authenticate,
  authorize('permissions_update'),
  validate(uuidParamSchema, 'params'),
  validate(updatePermissionSchema),
  controller.update
);

router.delete(
  '/:uuid',
  authenticate,
  authorize('permissions_delete'),
  validate(uuidParamSchema, 'params'),
  controller.remove
);

module.exports = router;
