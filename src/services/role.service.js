const {
  createRole,
  getRoles,
  getRoleById,
  getRoleByName,
  updateRole,
  deleteRole,
  assignPermission,
  getRolePermissions
} = require('../models/role.model');

/* =====================================================
   CREAR
===================================================== */
const createRoleService = async (data) => {

  const exists = await getRoleByName(data.name);

  if (exists.rowCount > 0) {
    throw new Error('ROLE_ALREADY_EXISTS');
  }

  return createRole(data.name, data.description);
};

/* =====================================================
   OBTENER TODOS
===================================================== */
const getRolesService = async () => {
  return getRoles();
};

/* =====================================================
   OBTENER UNO
===================================================== */
const getRoleService = async (id) => {
  return getRoleById(id);
};

/* =====================================================
   ACTUALIZAR
===================================================== */
const updateRoleService = async (id, data) => {

  const existing = await getRoleById(id);

  if (existing.rowCount === 0) {
    throw new Error('ROLE_NOT_FOUND');
  }

  return updateRole(id, data.name, data.description);
};

/* =====================================================
   ELIMINAR
===================================================== */
const deleteRoleService = async (id) => {

  const existing = await getRoleById(id);

  if (existing.rowCount === 0) {
    throw new Error('ROLE_NOT_FOUND');
  }

  return deleteRole(id);
};

/* =====================================================
   ASIGNAR PERMISO
===================================================== */
const assignPermissionService = async (roleId, permissionId) => {
  return assignPermission(roleId, permissionId);
};

const removePermissionService = async (roleId, permissionId) => {
  return removePermission(roleId, permissionId);
};


/* =====================================================
   OBTENER PERMISOS
===================================================== */
const getRolePermissionsService = async (roleId) => {
  return getRolePermissions(roleId);
};

module.exports = {
  createRoleService,
  getRolesService,
  getRoleService,
  updateRoleService,
  deleteRoleService,
  assignPermissionService,
  getRolePermissionsService,
  removePermissionService,
};
