const AppError = require('../utils/AppError');

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {

    if (!req.user)
      return next(new AppError('No autenticado', 401));

    const userRoles = req.user.roles || [];

    const hasRole = userRoles.some(role =>
      allowedRoles.includes(role)
    );

    if (!hasRole)
      return next(new AppError('Rol no autorizado', 403));

    next();
  };
};

module.exports = authorizeRoles;
