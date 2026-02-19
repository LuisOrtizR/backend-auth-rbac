const {
  createRole,
  getRoles,
  getRoleById,
  getRoleByName,
  updateRole,
  deleteRole,
  assignPermission,
  removePermission,
  getRolePermissions
} = require('./role.model');

const { findById } = require('../permission/permission.model');
const AppError = require('../shared/utils/AppError');

const PROTECTED_ADMIN_PERMISSIONS = [
  'users_read',
  'users_update',
  'users_delete',
  'users_change_role',
  'requests_create',
  'requests_read',
  'requests_read_all',
  'requests_update',
  'requests_delete',
  'create_roles',
  'view_roles',
  'edit_roles',
  'delete_roles',
  'assign_permissions',
  'permissions_create',
  'permissions_read',
  'permissions_update',
  'permissions_delete'
];

const createRoleService = async ({ name, description }) => {
  const exists = await getRoleByName(name);

  if (exists.rowCount)
    throw new Error('ROLE_ALREADY_EXISTS');

  return createRole(name, description);
};

const getRolesService = () => getRoles();

const getRoleService = (id) => getRoleById(id);

const updateRoleService = async (id, { name, description }) => {
  const existing = await getRoleById(id);

  if (!existing.rowCount)
    throw new Error('ROLE_NOT_FOUND');

  if (existing.rows[0].name === 'admin')
    throw new AppError('El rol administrador no puede modificarse', 403);

  return updateRole(id, name, description);
};

const deleteRoleService = async (id) => {
  const existing = await getRoleById(id);

  if (!existing.rowCount)
    throw new Error('ROLE_NOT_FOUND');

  if (existing.rows[0].name === 'admin')
    throw new AppError('El rol administrador no puede eliminarse', 403);

  return deleteRole(id);
};

const assignPermissionService = (roleId, permissionId) =>
  assignPermission(roleId, permissionId);

const removePermissionService = async (roleId, permissionId) => {
  const role = await getRoleById(roleId);

  if (!role.rowCount)
    throw new AppError('Rol no encontrado', 404);

  if (role.rows[0].name === 'admin') {
    const perm = await findById(permissionId);

    if (!perm.rowCount)
      throw new AppError('Permiso no encontrado', 404);

    if (PROTECTED_ADMIN_PERMISSIONS.includes(perm.rows[0].name))
      throw new AppError(
        'No se puede remover un permiso original del rol administrador',
        403
      );
  }

  return removePermission(roleId, permissionId);
};

const getRolePermissionsService = (roleId) =>
  getRolePermissions(roleId);

module.exports = {
  createRoleService,
  getRolesService,
  getRoleService,
  updateRoleService,
  deleteRoleService,
  assignPermissionService,
  removePermissionService,
  getRolePermissionsService
};