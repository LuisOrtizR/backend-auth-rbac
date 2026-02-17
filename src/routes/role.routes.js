// routes/role.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/role.controller');
const authenticate = require('../middleware/authenticate.middleware');
const authorize = require('../middleware/authorizePermission.middleware');
const validate = require('../middleware/validate.middleware');
const { idParamSchema, createRoleSchema, updateRoleSchema, assignPermissionSchema } = require('../validators/role.validator');

router.post('/', authenticate, authorize('manage_roles'), validate(createRoleSchema), controller.create);
router.get('/', authenticate, authorize('manage_roles'), controller.getAll);
router.get('/:id', authenticate, authorize('manage_roles'), validate(idParamSchema, 'params'), controller.getOne);
router.put('/:id', authenticate, authorize('manage_roles'), validate(idParamSchema, 'params'), validate(updateRoleSchema), controller.update);
router.delete('/:id', authenticate, authorize('manage_roles'), validate(idParamSchema, 'params'), controller.remove);
router.post('/:id/permissions', authenticate, authorize('manage_roles'), validate(idParamSchema, 'params'), validate(assignPermissionSchema), controller.addPermission);
router.get('/:id/permissions', authenticate, authorize('manage_roles'), validate(idParamSchema, 'params'), controller.permissions);

module.exports = router;
