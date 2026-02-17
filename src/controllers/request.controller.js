const {
  createRequestSchema,
  updateRequestSchema
} = require('../validators/request.validator');

const {
  createNewRequest,
  updateExistingRequest,
  getAllRequests,
  getRequestsByUser,
  getRequestById,
  deleteRequestById
} = require('../services/request.service');

/* =====================================================
   CREAR
===================================================== */
const create = async (req, res) => {
  try {
    const data = createRequestSchema.parse(req.body);
    const result = await createNewRequest(data, req.user.id);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log('ERROR CREATE REQUEST:', error); // ← agrega esto
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: 'Error creando solicitud' });
  }
};

/* =====================================================
   LISTAR TODAS (ADMIN)
===================================================== */
const getAll = async (req, res) => {
  const result = await getAllRequests();
  res.json(result.rows);
};

/* =====================================================
   LISTAR MIS SOLICITUDES
===================================================== */
const getMine = async (req, res) => {
  const result = await getRequestsByUser(req.user.id);
  res.json(result.rows);
};

/* =====================================================
   OBTENER UNA
===================================================== */
const getOne = async (req, res) => {
  try {
    const result = await getRequestById(req.params.id);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    res.json(result.rows[0]);

  } catch {
    res.status(500).json({ message: 'Error obteniendo solicitud' });
  }
};

/* =====================================================
   ACTUALIZAR
===================================================== */
const update = async (req, res) => {
  try {
    const data = updateRequestSchema.parse(req.body);

    const result = await updateExistingRequest(
      req.params.id,
      data,
      req.user
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada o sin permiso' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }

    res.status(500).json({ message: 'Error actualizando solicitud' });
  }
};

/* =====================================================
   ELIMINAR
===================================================== */
const remove = async (req, res) => {
  const result = await deleteRequestById(req.params.id, req.user);

  if (result.rowCount === 0) {
    return res.status(404).json({ message: 'Solicitud no encontrada o sin permiso' });
  }

  res.json({ message: 'Solicitud eliminada correctamente' });
};

module.exports = { create, getAll, getMine, getOne, update, remove };
