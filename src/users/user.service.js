const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
  findUserWithRolesAndPermissionsById
} = require('./user.model');

const AppError = require('../shared/utils/AppError');

const getUsersService = () => getAllUsers();

const getUserService = async (id) => {
  const user = await getUserById(id);
  if (!user) throw new Error('USER_NOT_FOUND');
  return user;
};

const updateUserService = async (id, data) => {
  const updated = await updateUser(id, data.name, data.email);
  if (!updated) throw new Error('USER_NOT_FOUND');
  return updated;
};

const deleteUserService = async (id) => {
  const user = await findUserWithRolesAndPermissionsById(id);

  if (!user) throw new Error('USER_NOT_FOUND');

  if (user.roles.includes('admin'))
    throw new AppError('No se puede eliminar un usuario administrador', 403);

  const deleted = await deleteUser(id);
  if (!deleted) throw new Error('USER_NOT_FOUND');
  return true;
};

const changeUserRoleService = async (id, role) => {
  const user = await getUserById(id);
  if (!user) throw new Error('USER_NOT_FOUND');
  return updateUserRole(id, role);
};

module.exports = {
  getUsersService,
  getUserService,
  updateUserService,
  deleteUserService,
  changeUserRoleService
};