const {
  createRequest,
  getAllRequests,
  getRequestsByUser,
  getRequestById,
  updateRequestFull,
  softDeleteRequest,
  getDeletedRequests,
  getDeletedRequestsByUser,
  getExpiredDeletedRequests,
  hardDeleteRequest,
  logRequestHistory,
  getRequestHistory
} = require('./request.model');

const AppError = require('../shared/utils/AppError');

const LOCKED_STATUSES = ['closed', 'rejected'];
const TRACKED_FIELDS  = ['title', 'description', 'status', 'priority', 'assigned_to', 'resolution'];

const FIELD_LABELS = {
  title: 'Título', description: 'Descripción', status: 'Estado',
  priority: 'Prioridad', assigned_to: 'Asignado a', resolution: 'Resolución'
};

const STATUS_LABELS = {
  open: 'Abierta', in_progress: 'En progreso', waiting_user: 'Esperando usuario',
  resolved: 'Resuelta', closed: 'Cerrada', rejected: 'Rechazada'
};

const PRIORITY_LABELS = {
  low: 'Baja', medium: 'Media', high: 'Alta', urgent: 'Urgente'
};

const buildDescription = (field, oldValue, newValue) => {
  const label = FIELD_LABELS[field] || field;
  if (field === 'status')
    return `Estado cambiado de "${STATUS_LABELS[oldValue] || oldValue}" a "${STATUS_LABELS[newValue] || newValue}"`;
  if (field === 'priority')
    return `Prioridad cambiada de "${PRIORITY_LABELS[oldValue] || oldValue}" a "${PRIORITY_LABELS[newValue] || newValue}"`;
  if (field === 'assigned_to') {
    if (!oldValue && newValue) return `Solicitud asignada a usuario ${newValue}`;
    if (oldValue && !newValue) return `Asignación removida`;
    return `Asignación cambiada`;
  }
  if (field === 'resolution') return !oldValue ? `Resolución agregada: "${newValue}"` : `Resolución actualizada`;
  if (field === 'title') return `Título actualizado de "${oldValue}" a "${newValue}"`;
  if (field === 'description') return `Descripción de la solicitud actualizada`;
  return `${label} actualizado`;
};

const _saveHistory = async (requestId, changedBy, current, newData) => {
  const changes = TRACKED_FIELDS
    .filter(field => newData[field] !== undefined && newData[field] !== null)
    .filter(field => String(current[field] ?? '') !== String(newData[field] ?? ''))
    .map(field => ({
      field,
      oldValue: current[field] ?? null,
      newValue: newData[field] ?? null,
      description: buildDescription(field, current[field] ?? null, newData[field] ?? null)
    }));

  if (changes.length) await logRequestHistory(requestId, changedBy, changes);
};

const createNewRequest = (data, userId) =>
  createRequest(data.title, data.description, userId, data.priority || 'medium');

const updateExistingRequest = async (id, data, user) => {
  const request = await getRequestById(id);
  if (!request.rowCount) return { rowCount: 0 };

  const current = request.rows[0];

  if (current.deleted_at)
    throw new AppError('La solicitud ha sido eliminada y no puede modificarse', 403);

  if (LOCKED_STATUSES.includes(current.status))
    throw new AppError(
      `La solicitud está ${current.status === 'closed' ? 'cerrada' : 'rechazada'} y no puede modificarse`,
      403
    );

  const isPrivileged = user.roles.includes('admin') || user.roles.includes('supervisor');

  if (!isPrivileged) {
    if (current.user_id !== user.id)
      throw new AppError('No autorizado', 403);
    if (current.status !== 'open')
      throw new AppError('Solo puedes editar una solicitud mientras esté en estado Abierta', 403);

    const updateData = { title: data.title, description: data.description };
    const result = await updateRequestFull(id, updateData);
    await _saveHistory(id, user.id, current, updateData);
    return result;
  }

  const result = await updateRequestFull(id, data);
  await _saveHistory(id, user.id, current, data);
  return result;
};

const deleteRequestById = async (id, user, reason) => {
  const request = await getRequestById(id);
  if (!request.rowCount) return { rowCount: 0 };

  const current = request.rows[0];

  if (current.deleted_at)
    throw new AppError('La solicitud ya fue eliminada', 400);

  const isPrivileged = user.roles.includes('admin') || user.roles.includes('supervisor');
  const canDelete = isPrivileged || (current.user_id === user.id && current.status === 'open');

  if (!canDelete) return { rowCount: 0 };

  if (!reason?.trim())
    throw new AppError('Debes indicar el motivo de eliminación', 400);

  await logRequestHistory(id, user.id, [{
    field: 'status',
    oldValue: current.status,
    newValue: 'deleted',
    description: `Solicitud marcada como eliminada. Motivo: "${reason.trim()}"`
  }]);

  return softDeleteRequest(id, reason.trim());
};

const getDeletedRequestsService = () => getDeletedRequests();

const getDeletedRequestsByUserService = (userId) => getDeletedRequestsByUser(userId);

const getHistoryByRequest = (requestId) => getRequestHistory(requestId);

const purgeExpiredRequests = async (sendPurgeNotificationEmail) => {
  const result = await getExpiredDeletedRequests();
  const expired = result.rows;

  if (!expired.length) return 0;

  let purged = 0;
  for (const req of expired) {
    try {
      await sendPurgeNotificationEmail(req.email, req.title, req.deleted_reason);
      await hardDeleteRequest(req.id);
      purged++;
    } catch (err) {
      console.error(`Error purgando solicitud ${req.id}:`, err.message);
    }
  }

  return purged;
};

module.exports = {
  createNewRequest,
  updateExistingRequest,
  getAllRequests,
  getRequestsByUser,
  getRequestById,
  deleteRequestById,
  getDeletedRequestsService,
  getDeletedRequestsByUserService,
  getHistoryByRequest,
  purgeExpiredRequests
};