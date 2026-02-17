const db = require('../config/db');

const createPermission = (name, description) => {
  return db.query(
    `INSERT INTO permissions (id, name, description)
     VALUES (gen_random_uuid(), $1, $2)
     RETURNING *`,
    [name, description]
  );
};

const findByName = (name) => {
  return db.query(
    `SELECT * FROM permissions WHERE name = $1`,
    [name]
  );
};

const findById = (uuid) => {
  return db.query(
    `SELECT * FROM permissions WHERE id = $1`,
    [uuid]
  );
};

const updatePermission = (uuid, name, description) => {
  return db.query(
    `UPDATE permissions
     SET name = COALESCE($2, name),
         description = COALESCE($3, description)
     WHERE id = $1
     RETURNING *`,
    [uuid, name, description]
  );
};

const getPermissions = (limit, offset, search, sort, order) => {
  const values = [];
  let where = '';
  let idx = 1;

  if (search) {
    where = `WHERE name ILIKE $${idx++}`;
    values.push(`%${search}%`);
  }

  values.push(limit, offset);

  return db.query(
    `SELECT *
     FROM permissions
     ${where}
     ORDER BY ${sort} ${order}
     LIMIT $${idx++} OFFSET $${idx}`,
    values
  );
};

const countPermissions = (search) => {
  if (!search) {
    return db.query(`SELECT COUNT(*) FROM permissions`);
  }

  return db.query(
    `SELECT COUNT(*) FROM permissions WHERE name ILIKE $1`,
    [`%${search}%`]
  );
};

const isAssignedToRole = (uuid) => {
  return db.query(
    `SELECT 1 FROM role_permissions WHERE permission_id = $1`,
    [uuid]
  );
};

const deletePermission = (uuid) => {
  return db.query(
    `DELETE FROM permissions WHERE id = $1`,
    [uuid]
  );
};

module.exports = {
  createPermission,
  findByName,
  findById,
  updatePermission,
  getPermissions,
  countPermissions,
  isAssignedToRole,
  deletePermission
};
