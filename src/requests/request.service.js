const {
  createRequest,
  getAllRequests,
  getRequestsByUser,
  getRequestById,
  updateRequestFull,
  deleteRequest
} = require('../requests/request.model');

const pool = require('../shared/config/db');

/* =====================================================
   CREAR
===================================================== */
const createNewRequest = async (data, userId) => {
  return createRequest(
    data.title,
    data.description,
    userId,
    data.priority || 'medium'
  );
};

/* =====================================================
   ACTUALIZAR PROFESIONAL
===================================================== */
const updateExistingRequest = async (id, data, user) => {

  const request = await getRequestById(id);

  if (request.rowCount === 0) {
    return request;
  }

  const current = request.rows[0];

  // ADMIN puede modificar todo
  if (user.roles.includes('admin')) {
    return updateRequestFull(id, data);
  }

  // Usuario normal solo puede modificar si es dueño
  if (current.user_id !== user.id) {
    return { rowCount: 0 };
  }

  // Usuario normal NO puede cambiar status ni asignación
  const safeData = {
    title: data.title,
    description: data.description
  };

  return updateRequestFull(id, safeData);
};

/* =====================================================
   ELIMINAR
===================================================== */
const deleteRequestById = async (id, user) => {

  const request = await getRequestById(id);

  if (request.rowCount === 0) {
    return request;
  }

  const current = request.rows[0];

  if (user.roles.includes('admin') || current.user_id === user.id) {
    return deleteRequest(id);
  }

  return { rowCount: 0 };
};

module.exports = {
  createNewRequest,
  updateExistingRequest,
  getAllRequests,
  getRequestsByUser,
  getRequestById,
  deleteRequestById
};
