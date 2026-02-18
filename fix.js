require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

async function fix() {
  const newPassword = 'Luis20*!';
  const hash = await bcrypt.hash(newPassword, 12);
  console.log('Hash generado:', hash);
  const result = await pool.query(
    'UPDATE users SET password=\$1 WHERE email=\$2 RETURNING email, password',
    [hash, 'luisangel930115@gmail.com']
  );
  console.log('Actualizado:', result.rows[0].email);
  const verify = await bcrypt.compare(newPassword, result.rows[0].password);
  console.log('Verificacion:', verify ? 'CORRECTO' : 'FALLO');
  await pool.end();
}

fix().catch(console.error);