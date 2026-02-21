const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
  findUserWithRolesAndPermissionsById,
  emailExists
} = require('./user.model');

const AppError = require('../shared/utils/AppError');

const getUsersService = () => getAllUsers();

const getUserService = async (id) => {
  const user = await getUserById(id);
  if (!user) throw new AppError('Usuario no encontrado', 404);
  return user;
};

const updateUserService = async (id, data, currentUser) => {
  const user = await findUserWithRolesAndPermissionsById(id);
  if (!user) throw new AppError('Usuario no encontrado', 404);

  if (user.is_protected) {

    if (data.email && data.email !== user.email) {
      throw new AppError('No se puede modificar el email del Super Admin', 403);
    }

    return updateUser(id, data.name || user.name, user.email);
  }

  if (data.email) {
    const exists = await emailExists(data.email, id);
    if (exists)
      throw new AppError('El email ya está en uso', 400);
  }

  const updated = await updateUser(id, data.name, data.email);
  if (!updated) throw new AppError('Usuario no encontrado', 404);

  return updated;
};

const deleteUserService = async (id) => {
  const user = await findUserWithRolesAndPermissionsById(id);

  if (!user)
    throw new AppError('Usuario no encontrado', 404);

  if (user.is_protected)
    throw new AppError('No se puede eliminar un usuario protegido', 403);

  const deleted = await deleteUser(id);
  if (!deleted)
    throw new AppError('Usuario no encontrado', 404);

  return true;
};

const changeUserRoleService = async (id, role) => {
  const user = await findUserWithRolesAndPermissionsById(id);

  if (!user)
    throw new AppError('Usuario no encontrado', 404);

  if (user.is_protected)
    throw new AppError('No se puede modificar el rol del Super Admin', 403);

  return updateUserRole(id, role);
};

module.exports = {
  getUsersService,
  getUserService,
  updateUserService,
  deleteUserService,
  changeUserRoleService
};