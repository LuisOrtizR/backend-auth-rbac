const pool = require('../shared/config/db');

/* =====================================================
   HELPER: Convertir array de PostgreSQL a JavaScript
===================================================== */
const parsePostgresArray = (pgArray) => {
  if (!pgArray) return [];
  if (Array.isArray(pgArray)) return pgArray;
  
  // Si es string tipo "{val1,val2}", convertir a array
  if (typeof pgArray === 'string') {
    const cleaned = pgArray.replace(/^{|}$/g, '');
    if (cleaned === '') return [];
    return cleaned.split(',');
  }
  
  return [];
};

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
   LOGIN - CON ROLES Y PERMISOS
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
        ARRAY[]::VARCHAR[]
      ) AS roles,
      COALESCE(
        ARRAY_AGG(DISTINCT p.name)
        FILTER (WHERE p.name IS NOT NULL),
        ARRAY[]::VARCHAR[]
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

  const user = result.rows[0];
  
  if (user) {
    // Asegurar que roles y permissions son arrays de JavaScript
    user.roles = parsePostgresArray(user.roles);
    user.permissions = parsePostgresArray(user.permissions);
  }

  return user;
};

/* =====================================================
   AUTH MIDDLEWARE - CON ROLES Y PERMISOS
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
        ARRAY[]::VARCHAR[]
      ) AS roles,
      COALESCE(
        ARRAY_AGG(DISTINCT p.name)
        FILTER (WHERE p.name IS NOT NULL),
        ARRAY[]::VARCHAR[]
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

  const user = result.rows[0];
  
  if (user) {
    // Asegurar que roles y permissions son arrays de JavaScript
    user.roles = parsePostgresArray(user.roles);
    user.permissions = parsePostgresArray(user.permissions);
  }

  return user;
};

/* =====================================================
   OBTENER TODOS LOS USUARIOS (CON ROLE)
===================================================== */
/* =====================================================
   OBTENER TODOS LOS USUARIOS (CON ROLES Y PERMISOS)
===================================================== */
const getAllUsers = async () => {
  const result = await pool.query(
    `
    SELECT 
      u.id,
      u.name,
      u.email,
      u.is_active,
      u.created_at,
      COALESCE(
        ARRAY_AGG(DISTINCT r.name)
        FILTER (WHERE r.name IS NOT NULL),
        ARRAY[]::VARCHAR[]
      ) AS roles,
      COALESCE(
        ARRAY_AGG(DISTINCT p.name)
        FILTER (WHERE p.name IS NOT NULL),
        ARRAY[]::VARCHAR[]
      ) AS permissions
    FROM users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.id
    LEFT JOIN role_permissions rp ON r.id = rp.role_id
    LEFT JOIN permissions p ON rp.permission_id = p.id
    GROUP BY u.id, u.name, u.email, u.is_active, u.created_at
    ORDER BY u.created_at DESC
    `
  );

  // Parsear arrays para cada usuario
  return result.rows.map(user => ({
    ...user,
    roles: parsePostgresArray(user.roles),
    permissions: parsePostgresArray(user.permissions)
  }));
};

/* =====================================================
   OBTENER USUARIO POR ID (CON ROLE)
===================================================== */
const getUserById = async (id) => {
  const result = await pool.query(
    `
    SELECT 
      u.id,
      u.name,
      u.email,
      u.is_active,
      u.created_at,
      COALESCE(r.name, 'user') AS role
    FROM users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.id
    WHERE u.id = $1
    `,
    [id]
  );

  return result.rows[0];
};

/* =====================================================
   BUSCAR USUARIO POR EMAIL (SIMPLE)
===================================================== */
const findUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT id, name, email, password, is_active, created_at
     FROM users 
     WHERE email = $1`,
    [email]
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
         email = $2,
         updated_at = NOW()
     WHERE id = $3
     RETURNING id, name, email, is_active`,
    [name, email, id]
  );

  return result.rows[0];
};

/* =====================================================
   ACTUALIZAR PASSWORD
===================================================== */
const updateUserPassword = async (id, hashedPassword) => {
  const result = await pool.query(
    `UPDATE users
     SET password = $1,
         updated_at = NOW()
     WHERE id = $2
     RETURNING id`,
    [hashedPassword, id]
  );

  return result.rows[0];
};

/* =====================================================
   CAMBIAR ROL (SOLO UNO)
===================================================== */
const updateUserRole = async (userId, roleName) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Verificar que el rol existe
    const roleResult = await client.query(
      `SELECT id FROM roles WHERE name = $1`,
      [roleName]
    );

    if (!roleResult.rows.length) {
      throw new Error('ROLE_NOT_FOUND');
    }

    const roleId = roleResult.rows[0].id;

    // Verificar si el usuario ya tiene una relación en user_roles
    const existingRelation = await client.query(
      `SELECT user_id FROM user_roles WHERE user_id = $1`,
      [userId]
    );

    if (existingRelation.rows.length > 0) {
      // Actualizar el rol existente
      await client.query(
        `UPDATE user_roles
         SET role_id = $1
         WHERE user_id = $2`,
        [roleId, userId]
      );
    } else {
      // Insertar nueva relación
      await client.query(
        `INSERT INTO user_roles (user_id, role_id)
         VALUES ($1, $2)`,
        [userId, roleId]
      );
    }

    await client.query('COMMIT');

    return { userId, role: roleName };

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/* =====================================================
   ACTIVAR/DESACTIVAR USUARIO
===================================================== */
const toggleUserActiveStatus = async (id, isActive) => {
  const result = await pool.query(
    `UPDATE users
     SET is_active = $1,
         updated_at = NOW()
     WHERE id = $2
     RETURNING id, is_active`,
    [isActive, id]
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
   VERIFICAR SI EMAIL EXISTE
===================================================== */
const emailExists = async (email, excludeUserId = null) => {
  let query = `SELECT id FROM users WHERE email = $1`;
  const params = [email];

  if (excludeUserId) {
    query += ` AND id != $2`;
    params.push(excludeUserId);
  }

  const result = await pool.query(query, params);
  return result.rows.length > 0;
};

/* =====================================================
   CONTAR USUARIOS
===================================================== */
const countUsers = async () => {
  const result = await pool.query(`SELECT COUNT(*) FROM users`);
  return parseInt(result.rows[0].count);
};

/* =====================================================
   CONTAR USUARIOS POR ROL
===================================================== */
const countUsersByRole = async (roleName) => {
  const result = await pool.query(
    `SELECT COUNT(*) 
     FROM users u
     JOIN user_roles ur ON u.id = ur.user_id
     JOIN roles r ON ur.role_id = r.id
     WHERE r.name = $1`,
    [roleName]
  );
  return parseInt(result.rows[0].count);
};

module.exports = {
  // Core CRUD
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  
  // Auth
  findUserByEmail,
  findUserWithRolesByEmail,
  findUserWithRolesAndPermissionsById,
  
  // Roles
  updateUserRole,
  
  // Password
  updateUserPassword,
  
  // Status
  toggleUserActiveStatus,
  
  // Utils
  emailExists,
  countUsers,
  countUsersByRole
};