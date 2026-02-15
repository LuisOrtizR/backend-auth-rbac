const pool = require('../config/db');

const createRequest = (title, description, userId) => {
  return pool.query(
    `INSERT INTO requests (title, description, user_id)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [title, description, userId]
  );
};

const getAllRequests = () => {
  return pool.query(
    `SELECT r.*, u.email
     FROM requests r
     JOIN users u ON u.id = r.user_id
     ORDER BY r.created_at DESC`
  );
};

const getRequestsByUser = (userId) => {
  return pool.query(
    `SELECT *
     FROM requests
     WHERE user_id=$1
     ORDER BY created_at DESC`,
    [userId]
  );
};

const getRequestById = (id) => {
  return pool.query(
    `SELECT *
     FROM requests
     WHERE id=$1`,
    [id]
  );
};

const updateRequest = (id, title, description, status) => {
  return pool.query(
    `UPDATE requests
     SET title=$1,
         description=$2,
         status=COALESCE($3,status)
     WHERE id=$4
     RETURNING *`,
    [title, description, status, id]
  );
};

const deleteRequest = (id) => {
  return pool.query(
    `DELETE FROM requests
     WHERE id=$1`,
    [id]
  );
};

module.exports = {
  createRequest,
  getAllRequests,
  getRequestsByUser,
  getRequestById,
  updateRequest,
  deleteRequest
};
