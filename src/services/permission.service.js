const permissionModel = require('../models/permission.model');
const AppError = require('../utils/AppError');

/* =====================================================
   CREAR
===================================================== */
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

/* =====================================================
   LISTAR CON PAGINACIÓN
===================================================== */
const getPermissionsService = async (page = 1, limit = 10) => {

  const offset = (page - 1) * limit;

  const data = await permissionModel.getPermissionsPaginated(limit, offset);
  const totalResult = await permissionModel.countPermissions();

  const total = parseInt(totalResult.rows[0].count);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    data: data.rows
  };
};

/* =====================================================
   OBTENER UNO POR UUID
===================================================== */
const getPermissionByUuidService = async (uuid) => {

  const result = await permissionModel.findFullById(uuid);

  if (result.rowCount === 0) {
    throw new AppError('Permiso no encontrado', 404);
  }

  return result;
};

/* =====================================================
   ELIMINAR CON PROTECCIÓN
===================================================== */
const deletePermissionService = async (uuid) => {

  const existing = await permissionModel.findFullById(uuid);

  if (existing.rowCount === 0) {
    throw new AppError('Permiso no encontrado', 404);
  }

  const assigned = await permissionModel.isAssignedToRole(uuid);

  if (assigned.rowCount > 0) {
    throw new AppError('No se puede eliminar. Permiso asignado a un rol', 409);
  }

  return permissionModel.deletePermission(uuid);
};

module.exports = {
  createPermissionService,
  getPermissionsService,
  getPermissionByUuidService,
  deletePermissionService
};
