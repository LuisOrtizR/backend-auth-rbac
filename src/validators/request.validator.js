const { z } = require('zod');

const createRequestSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5)
});

const updateRequestSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  status: z.enum(['pending', 'approved', 'rejected']).optional()
});

module.exports = {
  createRequestSchema,
  updateRequestSchema
};
