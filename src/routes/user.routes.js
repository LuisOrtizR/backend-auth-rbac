const express = require('express');
const router = express.Router();

const controller = require('../controllers/user.controller');
const authenticate = require('../middleware/authenticate.middleware');
const authorizeRole = require('../middleware/authorizeRoles.middleware');
const authorizePermission = require('../middleware/authorizePermission.middleware');
const validate = require('../middleware/validate.middleware');

const {
  idParamSchema,
  updateUserSchema,
  changeRoleSchema
} = require('../validators/user.validator');

/* =====================================================
   🔥 RUTAS PROPIAS (/me) - DEBEN IR PRIMERO
===================================================== */
router.get('/me', authenticate, controller.getMe);
router.put('/me', authenticate, validate(updateUserSchema), controller.updateMe);
router.delete('/me', authenticate, controller.removeMe);

/* =====================================================
   RUTAS ADMIN - VAN DESPUÉS
===================================================== */
router.get('/', authenticate, authorizePermission('users_read', 'users_manage'), controller.getAll);
router.get('/:id', authenticate, authorizePermission('users_read', 'users_manage'), validate(idParamSchema, 'params'), controller.getOne);
router.put('/:id', authenticate, authorizePermission('users_update', 'users_manage'), validate(idParamSchema, 'params'), validate(updateUserSchema), controller.update);
router.delete('/:id', authenticate, authorizePermission('users_delete', 'users_manage'), validate(idParamSchema, 'params'), controller.remove);
router.patch('/:id/role', authenticate, authorizePermission('users_change_role', 'users_manage'), validate(idParamSchema, 'params'), validate(changeRoleSchema), controller.changeRole);

module.exports = router;
