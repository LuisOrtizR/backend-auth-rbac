const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole
} = require('./user.model');

const getUsersService = async () => {
  return await getAllUsers();
};

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
  const deleted = await deleteUser(id);
  if (!deleted) throw new Error('USER_NOT_FOUND');
  return true;
};

const changeUserRoleService = async (id, role) => {
  const user = await getUserById(id);
  if (!user) throw new Error('USER_NOT_FOUND');

  return await updateUserRole(id, role);
};

module.exports = {
  getUsersService,
  getUserService,
  updateUserService,
  deleteUserService,
  changeUserRoleService
};
