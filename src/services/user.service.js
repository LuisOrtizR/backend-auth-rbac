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

  if (!user) {
    throw new Error('USER_NOT_FOUND');
  }

  return user;
};


/* =====================================================
   ACTUALIZAR
===================================================== */
const updateUserService = async (id, data) => {
  const updated = await updateUser(id, data.name, data.email);

  if (!updated) {
    throw new Error('USER_NOT_FOUND');
  }

  return updated;
};


/* =====================================================
   ELIMINAR
===================================================== */
const deleteUserService = async (id) => {
  const deleted = await deleteUser(id);

  if (!deleted) {
    throw new Error('USER_NOT_FOUND');
  }

  return true;
};


module.exports = {
  getUsersService,
  getUserService,
  updateUserService,
  deleteUserService
};
