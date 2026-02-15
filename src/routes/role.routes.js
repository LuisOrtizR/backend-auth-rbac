const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/authenticate.middleware');
const authorizePermission = require('../middleware/authorizePermission.middleware');
const validate = require('../middleware/validate.middleware');

const controller = require('../controllers/role.controller');

const {
  idParamSchema,
  createRoleSchema,
  updateRoleSchema,
  assignPermissionSchema
} = require('../validators/role.validator');

/* =====================================================
   ROLES
===================================================== */

router.post(
  '/',
  authenticate,
  authorizePermission('manage_roles'),
  validate(createRoleSchema),
  controller.create
);

router.get(
  '/',
  authenticate,
  authorizePermission('manage_roles'),
  controller.getAll
);

router.get(
  '/:id',
  authenticate,
  authorizePermission('manage_roles'),
  validate(idParamSchema, 'params'),
  controller.getOne
);

router.put(
  '/:id',
  authenticate,
  authorizePermission('manage_roles'),
  validate(idParamSchema, 'params'),
  validate(updateRoleSchema),
  controller.update
);

router.delete(
  '/:id',
  authenticate,
  authorizePermission('manage_roles'),
  validate(idParamSchema, 'params'),
  controller.remove
);

router.post(
  '/:id/permissions',
  authenticate,
  authorizePermission('manage_roles'),
  validate(idParamSchema, 'params'),
  validate(assignPermissionSchema),
  controller.addPermission
);

router.get(
  '/:id/permissions',
  authenticate,
  authorizePermission('manage_roles'),
  validate(idParamSchema, 'params'),
  controller.permissions
);

module.exports = router;
