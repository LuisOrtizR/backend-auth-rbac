const express = require('express');
const router = express.Router();

const permissionController = require('../controllers/permission.controller');
const validate = require('../middleware/validate.middleware');
const authenticate = require('../middleware/authenticate.middleware');
const { createPermissionSchema, uuidParamSchema } = require('../validators/permission.validator');

/* =====================================================
   RUTAS
===================================================== */

router.post(
  '/',
  authenticate,
  validate(createPermissionSchema),
  permissionController.create
);

router.get(
  '/',
  authenticate,
  permissionController.getAll
);

router.get(
  '/:uuid',
  authenticate,
  validate(uuidParamSchema, 'params'),
  permissionController.getByUuid
);

router.delete(
  '/:uuid',
  authenticate,
  validate(uuidParamSchema, 'params'),
  permissionController.remove
);

module.exports = router;
