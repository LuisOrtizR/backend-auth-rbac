const pool = require('../config/db');
const {
  createRequest,
  getAllRequests,
  getRequestsByUser,
  getRequestById,
  updateRequest,
  deleteRequest
} = require('../models/request.model');

/* =====================================================
   CREAR
===================================================== */
const createNewRequest = async (data, userId) => {
  return createRequest(data.title, data.description, userId);
};

/* =====================================================
   OBTENER UNA
===================================================== */
const getRequestByIdService = async (id) => {
  return getRequestById(id);
};

/* =====================================================
   ACTUALIZAR
===================================================== */
const updateExistingRequest = async (id, data, user) => {

  // ADMIN puede modificar todo
  if (user.roles.includes('admin')) {
    return pool.query(
      `UPDATE requests
       SET title=$1,
           description=$2,
           status=COALESCE($3,status)
       WHERE id=$4
       RETURNING *`,
      [data.title, data.description, data.status, id]
    );
  }

  // Usuario normal solo puede modificar su propia solicitud
  return pool.query(
    `UPDATE requests
     SET title=$1,
         description=$2
     WHERE id=$3 AND user_id=$4
     RETURNING *`,
    [data.title, data.description, id, user.id]
  );
};

/* =====================================================
   ELIMINAR
===================================================== */
const deleteRequestById = async (id, user) => {

  // Admin elimina cualquiera
  if (user.roles.includes('admin')) {
    return deleteRequest(id);
  }

  // Usuario solo elimina la suya
  return pool.query(
    `DELETE FROM requests
     WHERE id=$1 AND user_id=$2`,
    [id, user.id]
  );
};

module.exports = {
  createNewRequest,
  updateExistingRequest,
  getAllRequests,
  getRequestsByUser,
  getRequestById: getRequestByIdService,
  deleteRequestById
};
