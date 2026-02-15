const {
  getUsersService,
  getUserService,
  updateUserService,
  deleteUserService,
  changeUserRoleService
} = require('../services/user.service');

/* =====================================================
   ADMIN - OBTENER TODOS
===================================================== */
const getAll = async (req, res) => {
  try {
    const users = await getUsersService();

    res.json({
      total: users.length,
      data: users
    });

  } catch {
    res.status(500).json({ message: 'Error obteniendo usuarios' });
  }
};

/* =====================================================
   ADMIN / SELF - OBTENER UNO POR ID
===================================================== */
const getOne = async (req, res) => {
  try {
    const requestedId = parseInt(req.params.id);
    const loggedUser = req.user;

    if (
      !loggedUser.roles.includes('admin') &&
      loggedUser.id !== requestedId
    ) {
      return res.status(403).json({
        message: 'No autorizado para ver este usuario'
      });
    }

    const user = await getUserService(requestedId);
    res.json(user);

  } catch (error) {
    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(500).json({ message: 'Error obteniendo usuario' });
  }
};

/* =====================================================
   🔥 PERFIL PROPIO - GET /me
===================================================== */
const getMe = async (req, res) => {
  try {
    const user = await getUserService(req.user.id);
    res.json(user);
  } catch {
    res.status(500).json({ message: 'Error obteniendo perfil' });
  }
};

/* =====================================================
   ADMIN / SELF - ACTUALIZAR POR ID
===================================================== */
const update = async (req, res) => {
  try {
    const requestedId = parseInt(req.params.id);
    const loggedUser = req.user;

    if (
      !loggedUser.roles.includes('admin') &&
      loggedUser.id !== requestedId
    ) {
      return res.status(403).json({
        message: 'No autorizado para actualizar este usuario'
      });
    }

    const updated = await updateUserService(requestedId, req.body);
    res.json(updated);

  } catch (error) {
    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(500).json({ message: 'Error actualizando usuario' });
  }
};

/* =====================================================
   🔥 PERFIL PROPIO - PUT /me
===================================================== */
const updateMe = async (req, res) => {
  try {
    const updated = await updateUserService(req.user.id, req.body);
    res.json(updated);
  } catch {
    res.status(500).json({ message: 'Error actualizando perfil' });
  }
};

/* =====================================================
   ADMIN / SELF - ELIMINAR POR ID
===================================================== */
const remove = async (req, res) => {
  try {
    const requestedId = parseInt(req.params.id);
    const loggedUser = req.user;

    if (
      !loggedUser.roles.includes('admin') &&
      loggedUser.id !== requestedId
    ) {
      return res.status(403).json({
        message: 'No autorizado para eliminar este usuario'
      });
    }

    await deleteUserService(requestedId);

    res.json({ message: 'Usuario eliminado correctamente' });

  } catch (error) {
    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(500).json({ message: 'Error eliminando usuario' });
  }
};

/* =====================================================
   🔥 PERFIL PROPIO - DELETE /me
===================================================== */
const removeMe = async (req, res) => {
  try {
    await deleteUserService(req.user.id);
    res.json({ message: 'Cuenta eliminada correctamente' });
  } catch {
    res.status(500).json({ message: 'Error eliminando cuenta' });
  }
};

/* =====================================================
   ADMIN - CAMBIAR ROL
===================================================== */
const changeRole = async (req, res) => {
  try {
    const updated = await changeUserRoleService(
      req.params.id,
      req.body.role
    );

    res.json(updated);

  } catch (error) {
    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(500).json({ message: 'Error cambiando rol' });
  }
};

module.exports = {
  getAll,
  getOne,
  getMe,
  update,
  updateMe,
  remove,
  removeMe,
  changeRole
};
