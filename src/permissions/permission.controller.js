const permissionService = require('./permission.service');

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const create = asyncHandler(async (req, res) => {
  const result = await permissionService.createPermissionService(req.body);
  res.status(201).json({ success: true, data: result.rows[0] });
});

const getAll = asyncHandler(async (req, res) => {
  const result = await permissionService.getPermissionsService(req.query);
  res.json({ success: true, ...result });
});

const getByUuid = asyncHandler(async (req, res) => {
  const result = await permissionService.getPermissionByUuidService(req.params.uuid);
  res.json({ success: true, data: result.rows[0] });
});

const update = asyncHandler(async (req, res) => {
  const result = await permissionService.updatePermissionService(
    req.params.uuid,
    req.body
  );
  res.json({ success: true, data: result.rows[0] });
});

const remove = asyncHandler(async (req, res) => {
  await permissionService.deletePermissionService(req.params.uuid);
  res.json({ success: true, message: 'Permiso eliminado' });
});

module.exports = {
  create,
  getAll,
  getByUuid,
  update,
  remove
};
