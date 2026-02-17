// routes/user.routes.js
const express = require('express');
const router = express.Router();

const controller = require('../controllers/user.controller');
const authenticate = require('../middleware/authenticate.middleware');
const authorize = require('../middleware/authorizePermission.middleware');
const validate = require('../middleware/validate.middleware');
const { idParamSchema, updateUserSchema, changeRoleSchema } = require('../validators/user.validator');

// PERFIL PROPIO
router.get('/me', authenticate, controller.getMe);
router.put('/me', authenticate, validate(updateUserSchema), controller.updateMe);
router.delete('/me', authenticate, controller.removeMe);

// ADMINISTRACIÓN DE USUARIOS
router.get('/', authenticate, authorize('users_read'), controller.getAll);
router.get('/:id', authenticate, authorize('users_read'), validate(idParamSchema, 'params'), controller.getOne);
router.put('/:id', authenticate, authorize('users_update'), validate(idParamSchema, 'params'), validate(updateUserSchema), controller.update);
router.delete('/:id', authenticate, authorize('users_delete'), validate(idParamSchema, 'params'), controller.remove);
router.patch('/:id/role', authenticate, authorize('users_change_role'), validate(idParamSchema, 'params'), validate(changeRoleSchema), controller.changeRole);

module.exports = router;
