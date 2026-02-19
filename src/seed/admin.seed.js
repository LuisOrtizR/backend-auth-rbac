require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../shared/config/db');

async function createAdmin() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1️⃣ Crear rol admin si no existe
    await client.query(`
      INSERT INTO roles (name, description)
      VALUES ('admin', 'Administrador del sistema')
      ON CONFLICT (name) DO NOTHING
    `);

    const roleResult = await client.query(
      `SELECT id FROM roles WHERE name = 'admin'`
    );
    const roleId = roleResult.rows[0].id;

    // 2️⃣ Asignar todos los permisos protegidos al rol admin
    const permsResult = await client.query(
      `SELECT id FROM permissions WHERE is_protected = TRUE`
    );

    for (const { id: permId } of permsResult.rows) {
      await client.query(
        `INSERT INTO role_permissions (role_id, permission_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [roleId, permId]
      );
    }

    console.log(`✅ ${permsResult.rows.length} permisos asignados al rol admin`);

    // 3️⃣ Verificar si el usuario admin ya existe
    const exists = await client.query(
      `SELECT id FROM users WHERE email = $1`,
      ['admin@empresa.com']
    );

    if (exists.rows.length > 0) {
      console.log('⚠️  Usuario admin ya existe — permisos del rol actualizados.');
      await client.query('COMMIT');
      process.exit();
    }

    // 4️⃣ Crear usuario admin
    const hashedPassword = await bcrypt.hash('Admin123*', 10);

    const userResult = await client.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id`,
      ['Super Admin', 'admin@empresa.com', hashedPassword]
    );

    const userId = userResult.rows[0].id;

    // 5️⃣ Asignar rol admin al usuario
    await client.query(
      `INSERT INTO user_roles (user_id, role_id)
       VALUES ($1, $2)`,
      [userId, roleId]
    );

    await client.query('COMMIT');
    console.log('✅ Usuario admin creado correctamente');
    process.exit();

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    client.release();
  }
}

createAdmin();