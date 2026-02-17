const permissionModel = require('../models/permission.model');
const AppError = require('../utils/AppError');

const protectedPermissions = [
  'users_read',
  'permissions_create',
  'permissions_read'
];

const createPermissionService = async (data) => {
  const existing = await permissionModel.findByName(data.name);

  if (existing.rowCount > 0) {
    throw new AppError('El permiso ya existe', 409);
  }

  return permissionModel.createPermission(
    data.name,
    data.description || null
  );
};

const getPermissionsService = async ({
  page = 1,
  limit = 10,
  search,
  sort = 'created_at',
  order = 'DESC'
}) => {
  const offset = (page - 1) * limit;

  const data = await permissionModel.getPermissions(
    limit,
    offset,
    search,
    sort,
    order
  );

  const totalResult = await permissionModel.countPermissions(search);
  const total = parseInt(totalResult.rows[0].count);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    data: data.rows
  };
};

const getPermissionByUuidService = async (uuid) => {
  const result = await permissionModel.findById(uuid);

  if (result.rowCount === 0) {
    throw new AppError('Permiso no encontrado', 404);
  }

  return result;
};

const updatePermissionService = async (uuid, data) => {
  const existing = await permissionModel.findById(uuid);

  if (existing.rowCount === 0) {
    throw new AppError('Permiso no encontrado', 404);
  }

  if (protectedPermissions.includes(existing.rows[0].name)) {
    throw new AppError('Permiso protegido', 403);
  }

  if (data.name) {
    const nameExists = await permissionModel.findByName(data.name);
    if (nameExists.rowCount > 0) {
      throw new AppError('Nombre de permiso ya existe', 409);
    }
  }

  return permissionModel.updatePermission(
    uuid,
    data.name,
    data.description
  );
};

const deletePermissionService = async (uuid) => {
  const existing = await permissionModel.findById(uuid);

  if (existing.rowCount === 0) {
    throw new AppError('Permiso no encontrado', 404);
  }

  if (protectedPermissions.includes(existing.rows[0].name)) {
    throw new AppError('Permiso protegido', 403);
  }

  const assigned = await permissionModel.isAssignedToRole(uuid);

  if (assigned.rowCount > 0) {
    throw new AppError('Permiso asignado a un rol', 409);
  }

  return permissionModel.deletePermission(uuid);
};

module.exports = {
  createPermissionService,
  getPermissionsService,
  getPermissionByUuidService,
  updatePermissionService,
  deletePermissionService
};
