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

  return updateRole(id, name, description);
};

const deleteRoleService = async (id) => {
  const existing = await getRoleById(id);

  if (!existing.rowCount)
    throw new Error('ROLE_NOT_FOUND');

  return deleteRole(id);
};

const assignPermissionService = (roleId, permissionId) =>
  assignPermission(roleId, permissionId);

const removePermissionService = (roleId, permissionId) =>
  removePermission(roleId, permissionId);

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
