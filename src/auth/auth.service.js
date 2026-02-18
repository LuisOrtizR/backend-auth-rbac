const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../shared/config/db');
const AppError = require('../shared/utils/AppError');

const { createUser, findUserWithRolesByEmail } = require('../users/user.model');
const emailService = require('../shared/services/email.service');

/* =====================================================
   TOKENS
===================================================== */

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      roles: (user.roles || []).filter(Boolean),
      permissions: (user.permissions || []).filter(Boolean)
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m' }
  );
};

const generateRefreshToken = async (userId) => {
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '7d' }
  );

  const decoded = jwt.decode(refreshToken);

  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES ($1,$2,to_timestamp($3))`,
    [userId, refreshToken, decoded.exp]
  );

  return refreshToken;
};

/* =====================================================
   REGISTER
===================================================== */

const registerUser = async ({ name, email, password }) => {
  const exists = await pool.query(
    'SELECT id FROM users WHERE email=$1',
    [email]
  );

  if (exists.rowCount > 0)
    throw new AppError('Usuario ya existe', 409);

  const hashedPassword = await bcrypt.hash(password, 12);

  // createUser ya devuelve el usuario directamente
  const userCreated = await createUser(name, email, hashedPassword);

  const roleResult = await pool.query(
    `SELECT id FROM roles WHERE name='user'`
  );

  if (roleResult.rowCount === 0)
    throw new AppError('Rol base no configurado', 500);

  await pool.query(
    `INSERT INTO user_roles (user_id, role_id)
     VALUES ($1,$2)`,
    [userCreated.id, roleResult.rows[0].id]
  );

  return {
    id: userCreated.id,
    name: userCreated.name,
    email: userCreated.email
  };
};


/* =====================================================
   LOGIN
===================================================== */

const loginUser = async ({ email, password }) => {
  const user = await findUserWithRolesByEmail(email);

  if (!user)
    throw new AppError('Credenciales inválidas', 401);

  const valid = await bcrypt.compare(password, user.password);

  if (!valid)
    throw new AppError('Credenciales inválidas', 401);

  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user.id);

  return { accessToken, refreshToken };
};

/* =====================================================
   REFRESH
===================================================== */

const refreshSession = async (refreshToken) => {
  if (!refreshToken)
    throw new AppError('Refresh token requerido', 400);

  const stored = await pool.query(
    `SELECT * FROM refresh_tokens
     WHERE token=$1 AND revoked=false`,
    [refreshToken]
  );

  if (stored.rowCount === 0)
    throw new AppError('Refresh inválido', 403);

  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET
  );

  const userResult = await pool.query(
    `SELECT u.id, u.email,
     ARRAY_REMOVE(ARRAY_AGG(DISTINCT r.name), NULL) as roles,
     ARRAY_REMOVE(ARRAY_AGG(DISTINCT p.name), NULL) as permissions
     FROM users u
     LEFT JOIN user_roles ur ON ur.user_id = u.id
     LEFT JOIN roles r ON r.id = ur.role_id
     LEFT JOIN role_permissions rp ON rp.role_id = r.id
     LEFT JOIN permissions p ON p.id = rp.permission_id
     WHERE u.id = $1
     GROUP BY u.id`,
    [decoded.id]
  );

  if (userResult.rowCount === 0)
    throw new AppError('Usuario no válido', 401);

  const user = userResult.rows[0];

  const newAccessToken = generateAccessToken(user);

  return { accessToken: newAccessToken };
};

/* =====================================================
   LOGOUT
===================================================== */

const logoutSession = async (refreshToken) => {
  if (!refreshToken)
    throw new AppError('Refresh token requerido', 400);

  await pool.query(
    `UPDATE refresh_tokens
     SET revoked=true
     WHERE token=$1`,
    [refreshToken]
  );
};

/* =====================================================
   FORGOT
===================================================== */

const forgotPassword = async (email) => {
  const userResult = await pool.query(
    'SELECT id FROM users WHERE email=$1',
    [email]
  );

  if (userResult.rowCount === 0)
    return;

  const userId = userResult.rows[0].id;

  const token = crypto.randomBytes(32).toString('hex');

  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const expires = new Date(Date.now() + 3600000);

  await pool.query(
    `INSERT INTO password_resets(user_id, token, expires_at)
     VALUES ($1,$2,$3)`,
    [userId, hashedToken, expires]
  );

  await sendPasswordResetEmail(email, token);
};

/* =====================================================
   RESET
===================================================== */

const resetPassword = async (token, newPassword) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const resetResult = await pool.query(
    `SELECT * FROM password_resets
     WHERE token=$1 AND expires_at > NOW()`,
    [hashedToken]
  );

  if (resetResult.rowCount === 0)
    throw new AppError('Token inválido o expirado', 400);

  const userId = resetResult.rows[0].user_id;

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await pool.query(
    'UPDATE users SET password=$1 WHERE id=$2',
    [hashedPassword, userId]
  );

  await pool.query(
    'DELETE FROM password_resets WHERE token=$1',
    [hashedToken]
  );
};

module.exports = {
  registerUser,
  loginUser,
  refreshSession,
  logoutSession,
  forgotPassword,
  resetPassword
};
