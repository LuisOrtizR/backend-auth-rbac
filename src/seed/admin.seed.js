require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../shared/config/db');

async function createAdmin() {
  try {
    const email = 'admin@empresa.com';

    // 1️⃣ Verificar si ya existe
    const exists = await pool.query(
      'SELECT * FROM users WHERE email=$1',
      [email]
    );

    if (exists.rows.length > 0) {
      console.log('Admin ya existe');
      process.exit();
    }

    // 2️⃣ Hashear password
    const hashedPassword = await bcrypt.hash('Admin123*', 10);

    // 3️⃣ Crear usuario (SIN role)
    const userResult = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1,$2,$3)
       RETURNING id`,
      ['Super Admin', email, hashedPassword]
    );

    const userId = userResult.rows[0].id;

    // 4️⃣ Buscar rol admin
    const roleResult = await pool.query(
      `SELECT id FROM roles WHERE name='admin'`
    );

    if (roleResult.rows.length === 0) {
      console.log('No existe el rol admin');
      process.exit();
    }

    const roleId = roleResult.rows[0].id;

    // 5️⃣ Insertar en user_roles
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id)
       VALUES ($1,$2)`,
      [userId, roleId]
    );

    console.log('Admin creado correctamente');
    process.exit();

  } catch (error) {
    console.error(error);
    process.exit();
  }
}

createAdmin();
