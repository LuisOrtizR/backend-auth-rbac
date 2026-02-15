const pool = require('../config/db');

/* =====================================================
   CREAR USUARIO
===================================================== */
const createUser = async (name, email, password) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, is_active, created_at`,
    [name, email, password]
  );

  return result.rows[0];
};


/* =====================================================
   BUSCAR USUARIO POR EMAIL (LOGIN)
   CON ROLES Y PERMISOS
===================================================== */
const findUserWithRolesByEmail = async (email) => {
  const result = await pool.query(
    `
    SELECT 
      u.id,
      u.name,
      u.email,
      u.password,
      u.is_active,
      COALESCE(
        ARRAY_AGG(DISTINCT r.name)
        FILTER (WHERE r.name IS NOT NULL),
        '{}'
      ) AS roles,
      COALESCE(
        ARRAY_AGG(DISTINCT p.name)
        FILTER (WHERE p.name IS NOT NULL),
        '{}'
      ) AS permissions
    FROM users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.id
    LEFT JOIN role_permissions rp ON r.id = rp.role_id
    LEFT JOIN permissions p ON rp.permission_id = p.id
    WHERE u.email = $1
    GROUP BY u.id
    `,
    [email]
  );

  return result.rows[0];
};


/* =====================================================
   BUSCAR USUARIO POR ID
   CON ROLES Y PERMISOS (AUTH MIDDLEWARE)
===================================================== */
const findUserWithRolesAndPermissionsById = async (id) => {
  const result = await pool.query(
    `
    SELECT 
      u.id,
      u.name,
      u.email,
      u.is_active,
      COALESCE(
        ARRAY_AGG(DISTINCT r.name)
        FILTER (WHERE r.name IS NOT NULL),
        '{}'
      ) AS roles,
      COALESCE(
        ARRAY_AGG(DISTINCT p.name)
        FILTER (WHERE p.name IS NOT NULL),
        '{}'
      ) AS permissions
    FROM users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.id
    LEFT JOIN role_permissions rp ON r.id = rp.role_id
    LEFT JOIN permissions p ON rp.permission_id = p.id
    WHERE u.id = $1
    GROUP BY u.id
    `,
    [id]
  );

  return result.rows[0];
};


/* =====================================================
   OBTENER TODOS LOS USUARIOS
===================================================== */
const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, name, email, is_active, created_at
     FROM users
     ORDER BY created_at DESC`
  );

  return result.rows;
};


/* =====================================================
   OBTENER USUARIO POR ID (BÁSICO)
===================================================== */
const getUserById = async (id) => {
  const result = await pool.query(
    `SELECT id, name, email, is_active, created_at
     FROM users
     WHERE id = $1`,
    [id]
  );

  return result.rows[0];
};


/* =====================================================
   ACTUALIZAR USUARIO
===================================================== */
const updateUser = async (id, name, email) => {
  const result = await pool.query(
    `UPDATE users
     SET name = $1,
         email = $2
     WHERE id = $3
     RETURNING id, name, email`,
    [name, email, id]
  );

  return result.rows[0];
};


/* =====================================================
   ELIMINAR USUARIO
===================================================== */
const deleteUser = async (id) => {
  const result = await pool.query(
    `DELETE FROM users
     WHERE id = $1
     RETURNING id`,
    [id]
  );

  return result.rows[0];
};


/* =====================================================
   EXPORTS
===================================================== */
module.exports = {
  createUser,
  findUserWithRolesByEmail,
  findUserWithRolesAndPermissionsById,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
