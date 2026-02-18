const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(3, 'Nombre mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Password mínimo 8 caracteres') // era 6
});

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Password requerido')
});

const refreshSchema = z.object({
  refreshToken: z.string().min(10)
});

const forgotSchema = z.object({
  email: z.string().email('Email inválido')
});

const resetSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8, 'Password mínimo 8 caracteres') // era 6
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema,
  forgotSchema,
  resetSchema
};
