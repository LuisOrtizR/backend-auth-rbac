const pool = require('../shared/config/db');

/* =====================================================
   CREAR - status 'open' por defecto
===================================================== */
const createRequest = (title, description, userId, priority = 'medium') => {
  return pool.query(
    `INSERT INTO requests (title, description, user_id, priority, status)
     VALUES ($1, $2, $3, $4, 'open')
     RETURNING *`,
    [title, description, userId, priority]
  );
};

/* =====================================================
   TODAS (admin/supervisor) - incluye email del creador
===================================================== */
const getAllRequests = () => {
  return pool.query(
    `SELECT r.*, u.email
     FROM requests r
     JOIN users u ON u.id = r.user_id
     ORDER BY r.created_at DESC`
  );
};

/* =====================================================
   POR USUARIO - incluye email para consistencia
===================================================== */
const getRequestsByUser = (userId) => {
  return pool.query(
    `SELECT r.*, u.email
     FROM requests r
     JOIN users u ON u.id = r.user_id
     WHERE r.user_id = $1
     ORDER BY r.created_at DESC`,
    [userId]
  );
};

/* =====================================================
   POR ID - incluye email
===================================================== */
const getRequestById = (id) => {
  return pool.query(
    `SELECT r.*, u.email
     FROM requests r
     JOIN users u ON u.id = r.user_id
     WHERE r.id = $1`,
    [id]
  );
};

/* =====================================================
   ACTUALIZAR - solo campos enviados (COALESCE)
   + resolved_at y closed_at automáticos
===================================================== */
const updateRequestFull = (id, data) => {
  const fields = [
    `title       = COALESCE($1, title)`,
    `description = COALESCE($2, description)`,
    `status      = COALESCE($3, status)`,
    `priority    = COALESCE($4, priority)`,
    `assigned_to = COALESCE($5, assigned_to)`,
    `resolution  = COALESCE($6, resolution)`,
    `updated_at  = NOW()`,
  ];

  // Fechas automáticas según estado
  if (data.status === 'resolved') fields.push(`resolved_at = NOW()`);
  if (data.status === 'closed')   fields.push(`closed_at   = NOW()`);

  return pool.query(
    `UPDATE requests
     SET ${fields.join(', ')}
     WHERE id = $7
     RETURNING *`,
    [
      data.title        ?? null,
      data.description  ?? null,
      data.status       ?? null,
      data.priority     ?? null,
      data.assigned_to  ?? null,
      data.resolution   ?? null,
      id
    ]
  );
};

/* =====================================================
   ELIMINAR
===================================================== */
const deleteRequest = (id) => {
  return pool.query(
    `DELETE FROM requests WHERE id = $1 RETURNING id`,
    [id]
  );
};

module.exports = {
  createRequest,
  getAllRequests,
  getRequestsByUser,
  getRequestById,
  updateRequestFull,
  deleteRequest
};