const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const { findUserWithRolesAndPermissionsById } = require('../../users/user.model');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer '))
      return next(new AppError('Token requerido', 401));

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    );

    const user = await findUserWithRolesAndPermissionsById(decoded.id);

    if (!user)
      return next(new AppError('Usuario no válido', 401));

    req.user = user;
    next();

  } catch {
    next(new AppError('Token inválido o expirado', 401));
  }
};

module.exports = authenticate;
