const pool = require('../config/db');

/* =====================================================
   CREAR ROL
===================================================== */
const createRole = (name, description) => {
  return pool.query(
    `INSERT INTO roles (name, description)
     VALUES ($1, $2)
     RETURNING *`,
    [name, description]
  );
};

/* =====================================================
   OBTENER TODOS
===================================================== */
const getRoles = () => {
  return pool.query(
    `SELECT * FROM roles ORDER BY id ASC`
  );
};

/* =====================================================
   OBTENER POR ID
===================================================== */
const getRoleById = (id) => {
  return pool.query(
    `SELECT * FROM roles WHERE id = $1`,
    [id]
  );
};

/* =====================================================
   OBTENER POR NOMBRE
===================================================== */
const getRoleByName = (name) => {
  return pool.query(
    `SELECT id FROM roles WHERE name = $1`,
    [name]
  );
};

/* =====================================================
   ACTUALIZAR
===================================================== */
const updateRole = (id, name, description) => {
  return pool.query(
    `UPDATE roles
     SET name = $1,
         description = $2
     WHERE id = $3
     RETURNING *`,
    [name, description, id]
  );
};

/* =====================================================
   ELIMINAR
===================================================== */
const deleteRole = (id) => {
  return pool.query(
    `DELETE FROM roles
     WHERE id = $1
     RETURNING id`,
    [id]
  );
};

/* =====================================================
   ASIGNAR PERMISO
===================================================== */
const assignPermission = (roleId, permissionId) => {
  return pool.query(
    `INSERT INTO role_permissions (role_id, permission_id)
     VALUES ($1, $2)`,
    [roleId, permissionId]
  );
};

/* =====================================================
   OBTENER PERMISOS DEL ROL
===================================================== */
const getRolePermissions = (roleId) => {
  return pool.query(
    `SELECT p.id, p.name, p.description
     FROM permissions p
     JOIN role_permissions rp ON p.id = rp.permission_id
     WHERE rp.role_id = $1`,
    [roleId]
  );
};

module.exports = {
  createRole,
  getRoles,
  getRoleById,
  getRoleByName,
  updateRole,
  deleteRole,
  assignPermission,
  getRolePermissions
};
