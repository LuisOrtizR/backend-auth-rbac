const { z } = require('zod');

const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID inválido')
});

const updateUserSchema = z.object({
  name: z.string().min(3, 'Nombre mínimo 3 caracteres'),
  email: z.string().email('Email inválido')
});

const changeRoleSchema = z.object({
  role: z.enum(['admin', 'user'])
});

module.exports = {
  idParamSchema,
  updateUserSchema,
  changeRoleSchema
};
