const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/authenticate.middleware');
const authorizePermission = require('../middleware/authorizePermission.middleware');
const validate = require('../middleware/validate.middleware');

const controller = require('../controllers/user.controller');

const {
  idParamSchema,
  updateUserSchema,
  changeRoleSchema
} = require('../validators/user.validator');

/* =====================================================
   PERFIL PROPIO
===================================================== */

router.get(
  '/me',
  authenticate,
  controller.getMe
);

router.put(
  '/me',
  authenticate,
  validate(updateUserSchema),
  controller.updateMe
);

router.delete(
  '/me',
  authenticate,
  controller.removeMe
);

/* =====================================================
   ADMIN
===================================================== */

router.get(
  '/',
  authenticate,
  authorizePermission('manage_users'),
  controller.getAll
);

router.get(
  '/:id',
  authenticate,
  validate(idParamSchema, 'params'),
  controller.getOne
);

router.put(
  '/:id',
  authenticate,
  validate(idParamSchema, 'params'),
  validate(updateUserSchema),
  controller.update
);

router.delete(
  '/:id',
  authenticate,
  validate(idParamSchema, 'params'),
  controller.remove
);

router.patch(
  '/:id/role',
  authenticate,
  validate(idParamSchema, 'params'),
  validate(changeRoleSchema),
  controller.changeRole
);

module.exports = router;
