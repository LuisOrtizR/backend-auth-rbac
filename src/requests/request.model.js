const pool = require('../shared/config/db');

const createRequest = (title, description, userId, priority = 'medium') =>
  pool.query(
    `INSERT INTO requests (title, description, user_id, priority, status)
     VALUES ($1, $2, $3, $4, 'open')
     RETURNING *`,
    [title, description, userId, priority]
  );

const getAllRequests = () =>
  pool.query(
    `SELECT r.*, u.email
     FROM requests r
     JOIN users u ON u.id = r.user_id
     ORDER BY r.created_at DESC`
  );

const getRequestsByUser = (userId) =>
  pool.query(
    `SELECT r.*, u.email
     FROM requests r
     JOIN users u ON u.id = r.user_id
     WHERE r.user_id = $1
     ORDER BY r.created_at DESC`,
    [userId]
  );

const getRequestById = (id) =>
  pool.query(
    `SELECT r.*, u.email
     FROM requests r
     JOIN users u ON u.id = r.user_id
     WHERE r.id = $1`,
    [id]
  );

const updateRequestFull = (id, data) => {
  const fields = [
    `title       = COALESCE($1, title)`,
    `description = COALESCE($2, description)`,
    `status      = COALESCE($3, status)`,
    `priority    = COALESCE($4, priority)`,
    `assigned_to = COALESCE($5, assigned_to)`,
    `resolution  = COALESCE($6, resolution)`,
    `updated_at  = NOW()`
  ];

  if (data.status === 'resolved') fields.push(`resolved_at = NOW()`);
  if (data.status === 'closed')   fields.push(`closed_at   = NOW()`);

  return pool.query(
    `UPDATE requests
     SET ${fields.join(', ')}
     WHERE id = $7
     RETURNING *`,
    [
      data.title       ?? null,
      data.description ?? null,
      data.status      ?? null,
      data.priority    ?? null,
      data.assigned_to ?? null,
      data.resolution  ?? null,
      id
    ]
  );
};

const deleteRequest = (id) =>
  pool.query(
    `DELETE FROM requests WHERE id = $1 RETURNING id`,
    [id]
  );

const logRequestHistory = (requestId, changedBy, changes) => {
  if (!changes.length) return Promise.resolve({ rows: [] });

  const values = [];
  const params = [];
  let i = 1;

  changes.forEach(({ field, oldValue, newValue, description }) => {
    values.push(`($${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++})`);
    params.push(requestId, changedBy, field, oldValue ?? null, newValue ?? null, description ?? null);
  });

  return pool.query(
    `INSERT INTO request_history (request_id, changed_by, field, old_value, new_value, description)
     VALUES ${values.join(', ')}`,
    params
  );
};

const getRequestHistory = (requestId) =>
  pool.query(
    `SELECT
       rh.id,
       rh.field,
       rh.old_value,
       rh.new_value,
       rh.description,
       rh.created_at,
       u.name  AS changed_by_name,
       u.email AS changed_by_email
     FROM request_history rh
     JOIN users u ON u.id = rh.changed_by
     WHERE rh.request_id = $1
     ORDER BY rh.created_at DESC`,
    [requestId]
  );

module.exports = {
  createRequest,
  getAllRequests,
  getRequestsByUser,
  getRequestById,
  updateRequestFull,
  deleteRequest,
  logRequestHistory,
  getRequestHistory
};