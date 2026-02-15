const authService = require('../services/auth.service');
const AppError = require('../utils/AppError');

const {
  registerSchema,
  loginSchema,
  refreshSchema,
  forgotSchema,
  resetSchema
} = require('../validators/auth.validator');

/* =====================================================
   REGISTER
===================================================== */
const register = async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);

    const user = await authService.registerUser(data);

    res.status(201).json({
      success: true,
      data: user
    });

  } catch (error) {
    next(error);
  }
};

/* =====================================================
   LOGIN
===================================================== */
const login = async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);

    const result = await authService.loginUser(data);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    next(error);
  }
};

/* =====================================================
   REFRESH
===================================================== */
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = refreshSchema.parse(req.body);

    const result = await authService.refreshSession(refreshToken);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    next(error);
  }
};

/* =====================================================
   LOGOUT
===================================================== */
const logout = async (req, res, next) => {
  try {
    await authService.logoutSession(req.body.refreshToken);

    res.json({
      success: true,
      message: 'Sesión cerrada correctamente'
    });

  } catch (error) {
    next(error);
  }
};

/* =====================================================
   FORGOT
===================================================== */
const forgot = async (req, res, next) => {
  try {
    const { email } = forgotSchema.parse(req.body);

    await authService.forgotPassword(email);

    res.json({
      success: true,
      message: 'Si el usuario existe, se envió un correo.'
    });

  } catch (error) {
    next(error);
  }
};

/* =====================================================
   RESET
===================================================== */
const reset = async (req, res, next) => {
  try {
    const { token, password } = resetSchema.parse(req.body);

    await authService.resetPassword(token, password);

    res.json({
      success: true,
      message: 'Contraseña actualizada correctamente'
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  forgot,
  reset
};
