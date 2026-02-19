const pool = require('../shared/config/db');

const createRole = (name, description) =>
  pool.query(
    `INSERT INTO roles (name, description)
     VALUES ($1, $2)
     RETURNING *`,
    [name, description]
  );

const getRoles = () =>
  pool.query(`SELECT * FROM roles ORDER BY id ASC`);

const getRoleById = (id) =>
  pool.query(`SELECT * FROM roles WHERE id = $1`, [id]);

const getRoleByName = (name) =>
  pool.query(`SELECT id FROM roles WHERE name = $1`, [name]);

const updateRole = (id, name, description) =>
  pool.query(
    `UPDATE roles
     SET name = $1,
         description = $2
     WHERE id = $3
     RETURNING *`,
    [name, description, id]
  );

const deleteRole = (id) =>
  pool.query(
    `DELETE FROM roles
     WHERE id = $1
     RETURNING id`,
    [id]
  );

const assignPermission = (roleId, permissionId) =>
  pool.query(
    `INSERT INTO role_permissions (role_id, permission_id)
     VALUES ($1, $2)`,
    [roleId, permissionId]
  );

const removePermission = (roleId, permissionId) =>
  pool.query(
    `DELETE FROM role_permissions
     WHERE role_id = $1 AND permission_id = $2`,
    [roleId, permissionId]
  );

const getRolePermissions = (roleId) =>
  pool.query(
    `SELECT p.id, p.name, p.description
     FROM permissions p
     JOIN role_permissions rp ON p.id = rp.permission_id
     WHERE rp.role_id = $1`,
    [roleId]
  );

module.exports = {
  createRole,
  getRoles,
  getRoleById,
  getRoleByName,
  updateRole,
  deleteRole,
  assignPermission,
  removePermission,
  getRolePermissions
};
  