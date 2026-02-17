const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../models/user.model');

/* =====================================================
   OBTENER TODOS
===================================================== */
const getUsersService = async () => {
  const users = await getAllUsers();
  return users; // ya es array
};

/* =====================================================
   OBTENER UNO
===================================================== */
const getUserService = async (id) => {
  const user = await getUserById(id);
  if (!user) throw new Error('USER_NOT_FOUND');
  return user;
};

/* =====================================================
   ACTUALIZAR
===================================================== */
const updateUserService = async (id, data) => {
  const updated = await updateUser(id, data.name, data.email);
  if (!updated) throw new Error('USER_NOT_FOUND');
  return updated;
};

/* =====================================================
   ELIMINAR
===================================================== */
const deleteUserService = async (id) => {
  const deleted = await deleteUser(id);
  if (!deleted) throw new Error('USER_NOT_FOUND');
  return true;
};

/* =====================================================
   CAMBIAR ROL
===================================================== */
const changeUserRoleService = async (id, role) => {
  // Aquí iría la lógica de asignación de rol
  // Ejemplo simple: buscar usuario, actualizar roleId o roles en la tabla
  const user = await getUserById(id);
  if (!user) throw new Error('USER_NOT_FOUND');

  // Suponiendo que tienes función updateRole en modelo:
  // await updateRoleForUser(id, role);

  return { id: user.id, role }; // retorno simple
};

module.exports = {
  getUsersService,
  getUserService,
  updateUserService,
  deleteUserService,
  changeUserRoleService
};
