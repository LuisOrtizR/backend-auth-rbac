const {
  createRoleService,
  getRolesService,
  getRoleService,
  updateRoleService,
  deleteRoleService,
  assignPermissionService,
  getRolePermissionsService
} = require('../roles/role.service');

/* =====================================================
   CREAR
===================================================== */
const create = async (req, res) => {
  try {
    const role = await createRoleService(req.body);
    res.status(201).json(role.rows[0]);
  } catch (error) {

    if (error.message === 'ROLE_ALREADY_EXISTS') {
      return res.status(409).json({
        message: 'El rol ya existe'
      });
    }

    res.status(500).json({ message: 'Error creando rol' });
  }
};

/* =====================================================
   OBTENER TODOS
===================================================== */
const getAll = async (req, res) => {
  const roles = await getRolesService();
  res.json(roles.rows);
};

/* =====================================================
   OBTENER UNO
===================================================== */
const getOne = async (req, res) => {
  const role = await getRoleService(req.params.id);

  if (!role.rows[0]) {
    return res.status(404).json({
      message: 'Rol no encontrado'
    });
  }

  res.json(role.rows[0]);
};

/* =====================================================
   ACTUALIZAR
===================================================== */
const update = async (req, res) => {
  try {
    const updated = await updateRoleService(
      req.params.id,
      req.body
    );

    res.json(updated.rows[0]);

  } catch (error) {

    if (error.message === 'ROLE_NOT_FOUND') {
      return res.status(404).json({
        message: 'Rol no encontrado'
      });
    }

    res.status(500).json({
      message: 'Error actualizando rol'
    });
  }
};

/* =====================================================
   ELIMINAR
===================================================== */
const remove = async (req, res) => {
  try {
    await deleteRoleService(req.params.id);
    res.json({ message: 'Rol eliminado correctamente' });
  } catch (error) {

    if (error.message === 'ROLE_NOT_FOUND') {
      return res.status(404).json({
        message: 'Rol no encontrado'
      });
    }

    res.status(500).json({
      message: 'Error eliminando rol'
    });
  }
};

/* =====================================================
   ASIGNAR PERMISO
===================================================== */
const addPermission = async (req, res) => {
  const { permissionId } = req.body;

  await assignPermissionService(
    req.params.id,
    permissionId
  );

  res.json({
    message: 'Permiso asignado correctamente'
  });
};

const removePermission = async (req, res, next) => {
  try {
    await removePermissionService(
      req.params.id,
      req.params.permissionId
    );

    res.json({
      success: true,
      message: 'Permiso removido correctamente'
    });
  } catch (error) {
    next(error);
  }
};


/* =====================================================
   OBTENER PERMISOS
===================================================== */
const permissions = async (req, res) => {
  const perms = await getRolePermissionsService(req.params.id);
  res.json(perms.rows);
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove,
  addPermission,
  permissions,
  removePermission,
};
