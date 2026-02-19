require('dotenv').config();
const pool = require('../shared/config/db');

const permissions = [
  // USUARIOS
  { name: 'users_read',        description: 'Ver lista de usuarios y detalle' },
  { name: 'users_update',      description: 'Editar datos de un usuario' },
  { name: 'users_delete',      description: 'Eliminar un usuario' },
  { name: 'users_change_role', description: 'Cambiar el rol de un usuario' },

  // ROLES
  { name: 'create_roles',      description: 'Crear nuevos roles' },
  { name: 'view_roles',        description: 'Ver roles y sus permisos' },
  { name: 'edit_roles',        description: 'Editar un rol existente' },
  { name: 'delete_roles',      description: 'Eliminar un rol' },
  { name: 'assign_permissions',description: 'Asignar o quitar permisos a un rol' },

  // PERMISOS
  { name: 'permissions_create', description: 'Crear nuevos permisos' },
  { name: 'permissions_read',   description: 'Ver lista de permisos' },
  { name: 'permissions_update', description: 'Editar un permiso' },
  { name: 'permissions_delete', description: 'Eliminar un permiso' },

  // SOLICITUDES
  { name: 'requests_create',   description: 'Crear una nueva solicitud' },
  { name: 'requests_read',     description: 'Ver solicitudes propias y detalle' },
  { name: 'requests_read_all', description: 'Ver todas las solicitudes (admin/agente)' },
  { name: 'requests_update',   description: 'Actualizar una solicitud' },
  { name: 'requests_delete',   description: 'Eliminar una solicitud' },
];

async function seedPermissions() {
  try {
    console.log('Insertando permisos...\n');

    for (const perm of permissions) {
      const result = await pool.query(
        `INSERT INTO permissions (name, description)
         VALUES ($1, $2)
         ON CONFLICT (name) DO NOTHING
         RETURNING name`,
        [perm.name, perm.description]
      );

      if (result.rows.length > 0) {
        console.log(`✅ Creado: ${perm.name}`);
      } else {
        console.log(`⚠️  Ya existe: ${perm.name}`);
      }
    }

    console.log('\nListo. Todos los permisos procesados.');
    process.exit();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

seedPermissions();