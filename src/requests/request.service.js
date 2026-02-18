const {
  createRequest,
  getAllRequests,
  getRequestsByUser,
  getRequestById,
  updateRequestFull,
  deleteRequest,
  logRequestHistory,
  getRequestHistory
} = require('./request.model');

const AppError = require('../shared/utils/AppError');

const LOCKED_STATUSES = ['closed', 'rejected'];
const TRACKED_FIELDS  = ['title', 'description', 'status', 'priority', 'assigned_to', 'resolution'];

const FIELD_LABELS = {
  title:       'Título',
  description: 'Descripción',
  status:      'Estado',
  priority:    'Prioridad',
  assigned_to: 'Asignado a',
  resolution:  'Resolución'
};

const STATUS_LABELS = {
  open:         'Abierta',
  in_progress:  'En progreso',
  waiting_user: 'Esperando usuario',
  resolved:     'Resuelta',
  closed:       'Cerrada',
  rejected:     'Rechazada'
};

const PRIORITY_LABELS = {
  low:    'Baja',
  medium: 'Media',
  high:   'Alta',
  urgent: 'Urgente'
};

const buildDescription = (field, oldValue, newValue) => {
  const label = FIELD_LABELS[field] || field;

  if (field === 'status') {
    const from = STATUS_LABELS[oldValue]   || oldValue;
    const to   = STATUS_LABELS[newValue]   || newValue;
    return `Estado cambiado de "${from}" a "${to}"`;
  }

  if (field === 'priority') {
    const from = PRIORITY_LABELS[oldValue] || oldValue;
    const to   = PRIORITY_LABELS[newValue] || newValue;
    return `Prioridad cambiada de "${from}" a "${to}"`;
  }

  if (field === 'assigned_to') {
    if (!oldValue && newValue) return `Solicitud asignada a usuario ${newValue}`;
    if (oldValue && !newValue) return `Asignación removida`;
    return `Asignación cambiada`;
  }

  if (field === 'resolution') {
    if (!oldValue) return `Resolución agregada: "${newValue}"`;
    return `Resolución actualizada`;
  }

  if (field === 'title') {
    return `Título actualizado de "${oldValue}" a "${newValue}"`;
  }

  if (field === 'description') {
    return `Descripción de la solicitud actualizada`;
  }

  return `${label} actualizado`;
};

const createNewRequest = (data, userId) =>
  createRequest(
    data.title,
    data.description,
    userId,
    data.priority || 'medium'
  );

const updateExistingRequest = async (id, data, user) => {
  const request = await getRequestById(id);

  if (!request.rowCount)
    return { rowCount: 0 };

  const current = request.rows[0];

  if (LOCKED_STATUSES.includes(current.status))
    throw new AppError(
      `La solicitud está ${current.status === 'closed' ? 'cerrada' : 'rechazada'} y no puede modificarse`,
      403
    );

  if (!user.roles.includes('admin')) {
    if (current.user_id !== user.id)
      return { rowCount: 0 };

    const updateData = {
      title:       data.title,
      description: data.description
    };

    const result = await updateRequestFull(id, updateData);
    await _saveHistory(id, user.id, current, updateData);
    return result;
  }

  const result = await updateRequestFull(id, data);
  await _saveHistory(id, user.id, current, data);
  return result;
};

const _saveHistory = async (requestId, changedBy, current, newData) => {
  const changes = TRACKED_FIELDS
    .filter(field => newData[field] !== undefined && newData[field] !== null)
    .filter(field => String(current[field] ?? '') !== String(newData[field] ?? ''))
    .map(field => ({
      field,
      oldValue:    current[field]  ?? null,
      newValue:    newData[field]  ?? null,
      description: buildDescription(field, current[field] ?? null, newData[field] ?? null)
    }));

  if (changes.length)
    await logRequestHistory(requestId, changedBy, changes);
};

const deleteRequestById = async (id, user) => {
  const request = await getRequestById(id);

  if (!request.rowCount)
    return { rowCount: 0 };

  const current = request.rows[0];

  if (LOCKED_STATUSES.includes(current.status))
    throw new AppError(
      `No se puede eliminar una solicitud ${current.status === 'closed' ? 'cerrada' : 'rechazada'}`,
      403
    );

  if (user.roles.includes('admin') || current.user_id === user.id)
    return deleteRequest(id);

  return { rowCount: 0 };
};

const getHistoryByRequest = (requestId) =>
  getRequestHistory(requestId);

module.exports = {
  createNewRequest,
  updateExistingRequest,
  getAllRequests,
  getRequestsByUser,
  getRequestById,
  deleteRequestById,
  getHistoryByRequest
};