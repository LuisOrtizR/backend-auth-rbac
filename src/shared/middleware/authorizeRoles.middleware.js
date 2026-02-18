const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        message: 'No autenticado'
      });
    }

    const userRoles = req.user.roles || [];

    const hasRole = userRoles.some(role =>
      allowedRoles.includes(role)
    );

    if (!hasRole) {
      return res.status(403).json({
        message: 'Rol no autorizado'
      });
    }

    next();
  };
};

module.exports = authorizeRoles;
