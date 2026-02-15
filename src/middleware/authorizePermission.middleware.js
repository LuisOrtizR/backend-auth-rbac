const authorizePermission = (requiredPermission) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const { roles = [], permissions = [] } = req.user;

    // 🔥 Admin tiene todos los permisos
    if (roles.includes('admin')) {
      return next();
    }

    if (!permissions.includes(requiredPermission)) {
      return res.status(403).json({
        message: `Permiso requerido: ${requiredPermission}`
      });
    }

    next();
  };
};

module.exports = authorizePermission;
