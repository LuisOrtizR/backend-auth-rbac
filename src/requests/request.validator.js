const { z } = require('zod');

const statusEnum = ['open', 'in_progress', 'waiting_user', 'resolved', 'closed', 'rejected'];
const priorityEnum = ['low', 'medium', 'high', 'urgent'];

const createRequestSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  priority: z.enum(priorityEnum).optional().default('medium')
});

const updateRequestSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(5).optional(),
  status: z.enum(statusEnum).optional(),
  priority: z.enum(priorityEnum).optional(),
  assigned_to: z.string().uuid().nullable().optional(),
  resolution: z.string().optional() 
});

module.exports = {
  createRequestSchema,
  updateRequestSchema
};