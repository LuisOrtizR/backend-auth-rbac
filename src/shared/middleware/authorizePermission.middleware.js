const authorizePermission = (requiredPermission) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const { roles = [], permissions = [] } = req.user;

    // 🔍 LOGS TEMPORALES DE DEBUG - BORRAR DESPUÉS
    console.log('\n========== DEBUG AUTORIZACIÓN ==========');
    console.log('📧 Usuario:', req.user.email);
    console.log('🎯 Permiso requerido:', requiredPermission);
    console.log('🎭 Roles del usuario:', roles);
    console.log('   Tipo:', typeof roles);
    console.log('   Es Array?:', Array.isArray(roles));
    console.log('🔑 Permisos del usuario:', permissions);
    console.log('   Tipo:', typeof permissions);
    console.log('   Es Array?:', Array.isArray(permissions));
    console.log('✅ Es admin?:', roles.includes('admin'));
    console.log('✅ Tiene el permiso?:', permissions.includes(requiredPermission));
    console.log('=========================================\n');

    // 🔥 Admin tiene todos los permisos
    if (roles.includes('admin')) {
      console.log('✅ Acceso concedido: es ADMIN');
      return next();
    }

    if (!permissions.includes(requiredPermission)) {
      console.log('❌ Acceso denegado: falta permiso');
      return res.status(403).json({
        message: `Permiso requerido: ${requiredPermission}`,
        userPermissions: permissions,
        userRoles: roles
      });
    }

    console.log('✅ Acceso concedido: tiene el permiso');
    next();
  };
};

module.exports = authorizePermission;