const permissionService = require('../services/permission.service');

const create = async (req, res, next) => {
  try {
    const result = await permissionService.createPermissionService(req.body);
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const result = await permissionService.getPermissionsService(req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const getByUuid = async (req, res, next) => {
  try {
    const result = await permissionService.getPermissionByUuidService(req.params.uuid);
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const result = await permissionService.updatePermissionService(
      req.params.uuid,
      req.body
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await permissionService.deletePermissionService(req.params.uuid);
    res.json({ success: true, message: 'Permiso eliminado' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getAll,
  getByUuid,
  update,
  remove
};
