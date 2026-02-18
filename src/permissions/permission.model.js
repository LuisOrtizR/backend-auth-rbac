const db = require('../shared/config/db');

const allowedSortFields = ['name', 'created_at'];
const allowedOrder = ['ASC', 'DESC'];

const createPermission = (name, description) =>
  db.query(
    `INSERT INTO permissions (id, name, description)
     VALUES (gen_random_uuid(), $1, $2)
     RETURNING *`,
    [name, description]
  );

const findByName = (name) =>
  db.query(`SELECT * FROM permissions WHERE name = $1`, [name]);

const findById = (uuid) =>
  db.query(`SELECT * FROM permissions WHERE id = $1`, [uuid]);

const updatePermission = (uuid, name, description) =>
  db.query(
    `UPDATE permissions
     SET name = COALESCE($2, name),
         description = COALESCE($3, description)
     WHERE id = $1
     RETURNING *`,
    [uuid, name, description]
  );

const getPermissions = (limit, offset, search, sort, order) => {
  const values = [];
  let where = '';
  let idx = 1;

  if (search) {
    where = `WHERE name ILIKE $${idx++}`;
    values.push(`%${search}%`);
  }

  const safeSort = allowedSortFields.includes(sort) ? sort : 'created_at';
  const safeOrder = allowedOrder.includes(order?.toUpperCase())
    ? order.toUpperCase()
    : 'DESC';

  values.push(limit, offset);

  return db.query(
    `SELECT *
     FROM permissions
     ${where}
     ORDER BY ${safeSort} ${safeOrder}
     LIMIT $${idx++} OFFSET $${idx}`,
    values
  );
};

const countPermissions = (search) =>
  search
    ? db.query(
        `SELECT COUNT(*) FROM permissions WHERE name ILIKE $1`,
        [`%${search}%`]
      )
    : db.query(`SELECT COUNT(*) FROM permissions`);

const isAssignedToRole = (uuid) =>
  db.query(
    `SELECT 1 FROM role_permissions WHERE permission_id = $1`,
    [uuid]
  );

const deletePermission = (uuid) =>
  db.query(`DELETE FROM permissions WHERE id = $1`, [uuid]);

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
