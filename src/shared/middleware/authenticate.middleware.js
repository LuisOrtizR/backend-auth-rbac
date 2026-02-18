const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const { findUserWithRolesAndPermissionsById } = require('../../users/user.model');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Token requerido', 401));
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await findUserWithRolesAndPermissionsById(decoded.id);

    if (!user) {
      return next(new AppError('Usuario no válido', 401));
    }

    // 🔍 LOGS TEMPORALES DE DEBUG - BORRAR DESPUÉS
    console.log('\n========== DEBUG AUTENTICACIÓN ==========');
    console.log('📧 Email:', user.email);
    console.log('🎭 Roles:', user.roles);
    console.log('   Tipo:', typeof user.roles);
    console.log('   Es Array?:', Array.isArray(user.roles));
    console.log('   Longitud:', user.roles?.length);
    console.log('🔑 Permisos:', user.permissions);
    console.log('   Tipo:', typeof user.permissions);
    console.log('   Es Array?:', Array.isArray(user.permissions));
    console.log('   Longitud:', user.permissions?.length);
    console.log('✅ Tiene "requests_create"?:', user.permissions?.includes('requests_create'));
    console.log('✅ Tiene "user" role?:', user.roles?.includes('user'));
    console.log('=========================================\n');

    req.user = user;

    next();

  } catch (error) {
    console.log("JWT ERROR:", error.message);
    next(new AppError('Token inválido o expirado', 401));
  }
};

module.exports = authenticate;