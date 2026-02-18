const authService = require('./auth.service');

const {
  registerSchema,
  loginSchema,
  refreshSchema,
  forgotSchema,
  resetSchema
} = require('./auth.validator');

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const register = asyncHandler(async (req, res) => {
  const data = registerSchema.parse(req.body);
  const user = await authService.registerUser(data);

  res.status(201).json({
    success: true,
    data: user
  });
});

const login = asyncHandler(async (req, res) => {
  const data = loginSchema.parse(req.body);
  const result = await authService.loginUser(data);

  res.json({
    success: true,
    data: result
  });
});

const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = refreshSchema.parse(req.body);
  const result = await authService.refreshSession(refreshToken);

  res.json({
    success: true,
    data: result
  });
});

const logout = asyncHandler(async (req, res) => {
  await authService.logoutSession(req.body.refreshToken);

  res.json({
    success: true,
    message: 'Sesión cerrada correctamente'
  });
});

const forgot = asyncHandler(async (req, res) => {
  const { email } = forgotSchema.parse(req.body);
  await authService.forgotPassword(email);

  res.json({
    success: true,
    message: 'Si el usuario existe, se envió un correo.'
  });
});

const reset = asyncHandler(async (req, res) => {
  const { token, password } = resetSchema.parse(req.body);
  await authService.resetPassword(token, password);

  res.json({
    success: true,
    message: 'Contraseña actualizada correctamente'
  });
});

module.exports = {
  register,
  login,
  refresh,
  logout,
  forgot,
  reset
};
