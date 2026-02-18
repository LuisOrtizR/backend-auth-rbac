const {
  createRoleService,
  getRolesService,
  getRoleService,
  updateRoleService,
  deleteRoleService,
  assignPermissionService,
  getRolePermissionsService,
  removePermissionService
} = require('./role.service');

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const create = asyncHandler(async (req, res) => {
  const role = await createRoleService(req.body);
  res.status(201).json(role.rows[0]);
});

const getAll = asyncHandler(async (req, res) => {
  const roles = await getRolesService();
  res.json(roles.rows);
});

const getOne = asyncHandler(async (req, res) => {
  const role = await getRoleService(req.params.id);

  if (!role.rowCount)
    return res.status(404).json({ message: 'Rol no encontrado' });

  res.json(role.rows[0]);
});

const update = asyncHandler(async (req, res) => {
  const updated = await updateRoleService(
    req.params.id,
    req.body
  );

  res.json(updated.rows[0]);
});

const remove = asyncHandler(async (req, res) => {
  await deleteRoleService(req.params.id);
  res.json({ message: 'Rol eliminado correctamente' });
});

const addPermission = asyncHandler(async (req, res) => {
  const { permissionId } = req.body;

  await assignPermissionService(
    req.params.id,
    permissionId
  );

  res.json({ message: 'Permiso asignado correctamente' });
});

const removePermission = asyncHandler(async (req, res) => {
  await removePermissionService(
    req.params.id,
    req.params.permissionId
  );

  res.json({
    message: 'Permiso removido correctamente'
  });
});

const permissions = asyncHandler(async (req, res) => {
  const perms = await getRolePermissionsService(req.params.id);
  res.json(perms.rows);
});

module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove,
  addPermission,
  removePermission,
  permissions
};
