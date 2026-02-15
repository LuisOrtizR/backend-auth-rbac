const { z } = require('zod');

/* =====================================================
   CREAR
===================================================== */
const createPermissionSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().max(255).optional()
});

/* =====================================================
   UUID PARAM
===================================================== */
const uuidParamSchema = z.object({
  uuid: z.string().uuid()
});

module.exports = {
  createPermissionSchema,
  uuidParamSchema
};
