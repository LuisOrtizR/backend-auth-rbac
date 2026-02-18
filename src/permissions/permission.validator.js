const { z } = require('zod');

const createPermissionSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().max(255).optional()
});

const updatePermissionSchema = z.object({
  name: z.string().min(3).max(50).optional(),
  description: z.string().max(255).optional()
});

const uuidParamSchema = z.object({
  uuid: z.string().uuid()
});

module.exports = {
  createPermissionSchema,
  updatePermissionSchema,
  uuidParamSchema
};
