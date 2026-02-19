require('dotenv').config();
const pool = require('../shared/config/db');

const permissions = [
  // USUARIOS
  { name: 'users_read',         description: 'Ver lista de usuarios y detalle',          is_protected: true },
  { name: 'users_update',       description: 'Editar datos de un usuario',               is_protected: true },
  { name: 'users_delete',       description: 'Eliminar un usuario',                      is_protected: true },
  { name: 'users_change_role',  description: 'Cambiar el rol de un usuario',             is_protected: true },

  // ROLES
  { name: 'create_roles',       description: 'Crear nuevos roles',                       is_protected: true },
  { name: 'view_roles',         description: 'Ver roles y sus permisos',                 is_protected: true },
  { name: 'edit_roles',         description: 'Editar un rol existente',                  is_protected: true },
  { name: 'delete_roles',       description: 'Eliminar un rol',                          is_protected: true },
  { name: 'assign_permissions', description: 'Asignar o quitar permisos a un rol',       is_protected: true },

  // PERMISOS
  { name: 'permissions_create', description: 'Crear nuevos permisos',                    is_protected: true },
  { name: 'permissions_read',   description: 'Ver lista de permisos',                    is_protected: true },
  { name: 'permissions_update', description: 'Editar un permiso',                        is_protected: true },
  { name: 'permissions_delete', description: 'Eliminar un permiso',                      is_protected: true },

  // SOLICITUDES
  { name: 'requests_create',    description: 'Crear una nueva solicitud',                is_protected: true },
  { name: 'requests_read',      description: 'Ver solicitudes propias y detalle',        is_protected: true },
  { name: 'requests_read_all',  description: 'Ver todas las solicitudes (admin/agente)', is_protected: true },
  { name: 'requests_update',    description: 'Actualizar una solicitud',                 is_protected: true },
  { name: 'requests_delete',    description: 'Eliminar una solicitud',                   is_protected: true },
];

async function seedPermissions() {
  try {
    // ✅ Asegurar que la columna exista sin romper si ya está
    await pool.query(`
      ALTER TABLE permissions
      ADD COLUMN IF NOT EXISTS is_protected BOOLEAN NOT NULL DEFAULT FALSE
    `);

    console.log('Insertando permisos...\n');

    for (const perm of permissions) {
      const result = await pool.query(
        `INSERT INTO permissions (name, description, is_protected)
         VALUES ($1, $2, $3)
         ON CONFLICT (name) DO UPDATE
           SET is_protected = EXCLUDED.is_protected
         RETURNING name, is_protected`,
        [perm.name, perm.description, perm.is_protected]
      );

      const { name, is_protected } = result.rows[0];
      console.log(`${is_protected ? '🔒' : '✅'} ${name}`);
    }

    console.log('\nListo. Todos los permisos procesados.');
    process.exit();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

seedPermissions();