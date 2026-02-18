const pool = require('../shared/config/db');

const parsePostgresArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/^{|}$/g, '');
    return cleaned ? cleaned.split(',') : [];
  }
  return [];
};

const createUser = async (name, email, password) => {
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, is_active, created_at`,
    [name, email, password]
  );
  return rows[0];
};

const findUserWithRolesByEmail = async (email) => {
  const { rows } = await pool.query(
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

  const user = rows[0];
  if (!user) return null;

  user.roles = parsePostgresArray(user.roles);
  user.permissions = parsePostgresArray(user.permissions);

  return user;
};

const findUserWithRolesAndPermissionsById = async (id) => {
  const { rows } = await pool.query(
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

  const user = rows[0];
  if (!user) return null;

  user.roles = parsePostgresArray(user.roles);
  user.permissions = parsePostgresArray(user.permissions);

  return user;
};

const getAllUsers = async () => {
  const { rows } = await pool.query(
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
    GROUP BY u.id
    ORDER BY u.created_at DESC
    `
  );

  return rows.map(user => ({
    ...user,
    roles: parsePostgresArray(user.roles),
    permissions: parsePostgresArray(user.permissions)
  }));
};

const getUserById = async (id) => {
  const { rows } = await pool.query(
    `
    SELECT 
      id,
      name,
      email,
      is_active,
      created_at
    FROM users
    WHERE id = $1
    `,
    [id]
  );
  return rows[0];
};

const findUserByEmail = async (email) => {
  const { rows } = await pool.query(
    `SELECT id, name, email, password, is_active, created_at
     FROM users
     WHERE email = $1`,
    [email]
  );
  return rows[0];
};

const updateUser = async (id, name, email) => {
  const { rows } = await pool.query(
    `UPDATE users
     SET name = $1,
         email = $2,
         updated_at = NOW()
     WHERE id = $3
     RETURNING id, name, email, is_active`,
    [name, email, id]
  );
  return rows[0];
};

const updateUserPassword = async (id, hashedPassword) => {
  const { rows } = await pool.query(
    `UPDATE users
     SET password = $1,
         updated_at = NOW()
     WHERE id = $2
     RETURNING id`,
    [hashedPassword, id]
  );
  return rows[0];
};

const updateUserRole = async (userId, roleName) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const roleResult = await client.query(
      `SELECT id FROM roles WHERE name = $1`,
      [roleName]
    );

    if (!roleResult.rows.length)
      throw new Error('ROLE_NOT_FOUND');

    const roleId = roleResult.rows[0].id;

    const existing = await client.query(
      `SELECT user_id FROM user_roles WHERE user_id = $1`,
      [userId]
    );

    if (existing.rows.length) {
      await client.query(
        `UPDATE user_roles SET role_id = $1 WHERE user_id = $2`,
        [roleId, userId]
      );
    } else {
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

const toggleUserActiveStatus = async (id, isActive) => {
  const { rows } = await pool.query(
    `UPDATE users
     SET is_active = $1,
         updated_at = NOW()
     WHERE id = $2
     RETURNING id, is_active`,
    [isActive, id]
  );
  return rows[0];
};

const deleteUser = async (id) => {
  const { rows } = await pool.query(
    `DELETE FROM users
     WHERE id = $1
     RETURNING id`,
    [id]
  );
  return rows[0];
};

const emailExists = async (email, excludeUserId = null) => {
  let query = `SELECT id FROM users WHERE email = $1`;
  const params = [email];

  if (excludeUserId) {
    query += ` AND id != $2`;
    params.push(excludeUserId);
  }

  const { rows } = await pool.query(query, params);
  return rows.length > 0;
};

const countUsers = async () => {
  const { rows } = await pool.query(`SELECT COUNT(*) FROM users`);
  return parseInt(rows[0].count, 10);
};

const countUsersByRole = async (roleName) => {
  const { rows } = await pool.query(
    `
    SELECT COUNT(*) 
    FROM users u
    JOIN user_roles ur ON u.id = ur.user_id
    JOIN roles r ON ur.role_id = r.id
    WHERE r.name = $1
    `,
    [roleName]
  );
  return parseInt(rows[0].count, 10);
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  findUserByEmail,
  findUserWithRolesByEmail,
  findUserWithRolesAndPermissionsById,
  updateUserRole,
  updateUserPassword,
  toggleUserActiveStatus,
  emailExists,
  countUsers,
  countUsersByRole
};
