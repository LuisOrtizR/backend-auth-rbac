const permissionService = require('../services/permission.service');

/* =====================================================
   CREAR
===================================================== */
const create = async (req, res, next) => {
  try {
    const result = await permissionService.createPermissionService(req.body);

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    next(error);
  }
};

/* =====================================================
   LISTAR
===================================================== */
const getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await permissionService.getPermissionsService(page, limit);

    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    next(error);
  }
};

/* =====================================================
   OBTENER UNO
===================================================== */
const getByUuid = async (req, res, next) => {
  try {
    const result = await permissionService.getPermissionByUuidService(req.params.uuid);

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    next(error);
  }
};

/* =====================================================
   ELIMINAR
===================================================== */
const remove = async (req, res, next) => {
  try {
    await permissionService.deletePermissionService(req.params.uuid);

    res.json({
      success: true,
      message: 'Permiso eliminado correctamente'
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getAll,
  getByUuid,
  remove
};
