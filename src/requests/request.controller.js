const {
  createNewRequest,
  updateExistingRequest,
  getAllRequests,
  getRequestsByUser,
  getRequestById,
  deleteRequestById,
  getDeletedRequestsService,
  getDeletedRequestsByUserService,
  getHistoryByRequest
} = require('./request.service');

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const create = asyncHandler(async (req, res) => {
  const result = await createNewRequest(req.body, req.user.id);
  res.status(201).json(result.rows[0]);
});

const getAll = asyncHandler(async (req, res) => {
  const result = await getAllRequests();
  res.json(result.rows);
});

const getMine = asyncHandler(async (req, res) => {
  const result = await getRequestsByUser(req.user.id);
  res.json(result.rows);
});

const getDeleted = asyncHandler(async (req, res) => {
  const isPrivileged = req.user.roles.includes('admin') || req.user.roles.includes('supervisor');
  const result = isPrivileged
    ? await getDeletedRequestsService()
    : await getDeletedRequestsByUserService(req.user.id);
  res.json(result.rows);
});

const getOne = asyncHandler(async (req, res) => {
  const result = await getRequestById(req.params.id);
  if (!result.rowCount)
    return res.status(404).json({ message: 'Solicitud no encontrada' });
  res.json(result.rows[0]);
});

const update = asyncHandler(async (req, res) => {
  const result = await updateExistingRequest(req.params.id, req.body, req.user);
  if (!result.rowCount)
    return res.status(404).json({ message: 'Solicitud no encontrada o sin permiso' });
  res.json(result.rows[0]);
});

const remove = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const result = await deleteRequestById(req.params.id, req.user, reason);
  if (!result.rowCount)
    return res.status(404).json({ message: 'Solicitud no encontrada o sin permiso' });
  res.json({ message: 'Solicitud eliminada correctamente' });
});

const getHistory = asyncHandler(async (req, res) => {
  const result = await getHistoryByRequest(req.params.id);
  res.json(result.rows);
});

module.exports = { create, getAll, getMine, getDeleted, getOne, update, remove, getHistory };