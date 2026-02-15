const db = require('../config/db');

/* =====================================================
   CREAR
===================================================== */
const createPermission = (name, description) => {
  return db.query(
    `INSERT INTO permissions (id, name, description)
     VALUES (uuid_generate_v4(), $1, $2)
     RETURNING *`,
    [name, description]
  );
};

/* =====================================================
   BUSCAR POR NOMBRE
===================================================== */
const findByName = (name) => {
  return db.query(
    `SELECT * FROM permissions WHERE name = $1`,
    [name]
  );
};

/* =====================================================
   LISTAR PAGINADO
===================================================== */
const getPermissionsPaginated = (limit, offset) => {
  return db.query(
    `SELECT * FROM permissions
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
};

/* =====================================================
   CONTAR
===================================================== */
const countPermissions = () => {
  return db.query(`SELECT COUNT(*) FROM permissions`);
};

/* =====================================================
   BUSCAR POR UUID
===================================================== */
const findFullById = (uuid) => {
  return db.query(
    `SELECT * FROM permissions WHERE id = $1`,
    [uuid]
  );
};

/* =====================================================
   VALIDAR SI ESTÁ ASIGNADO A UN ROL
===================================================== */
const isAssignedToRole = (uuid) => {
  return db.query(
    `SELECT * FROM role_permissions WHERE permission_id = $1`,
    [uuid]
  );
};

/* =====================================================
   ELIMINAR
===================================================== */
const deletePermission = (uuid) => {
  return db.query(
    `DELETE FROM permissions WHERE id = $1`,
    [uuid]
  );
};

module.exports = {
  createPermission,
  findByName,
  getPermissionsPaginated,
  countPermissions,
  findFullById,
  isAssignedToRole,
  deletePermission
};
