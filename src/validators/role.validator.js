const { z } = require('zod');

/* =====================================================
   VALIDAR UUID
===================================================== */
const idParamSchema = z.object({
  id: z.string().uuid('ID debe ser un UUID válido')
});

/* =====================================================
   CREAR ROL
===================================================== */
const createRoleSchema = z.object({
  name: z.string().min(3, 'Nombre mínimo 3 caracteres'),
  description: z.string().optional()
});

/* =====================================================
   ACTUALIZAR ROL
===================================================== */
const updateRoleSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional()
});

/* =====================================================
   ASIGNAR PERMISO
===================================================== */
const assignPermissionSchema = z.object({
  permissionId: z.string().uuid('permissionId debe ser UUID válido')
});

module.exports = {
  idParamSchema,
  createRoleSchema,
  updateRoleSchema,
  assignPermissionSchema
};
