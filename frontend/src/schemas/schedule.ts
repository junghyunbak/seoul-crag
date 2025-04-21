import { z } from 'zod';

export const scheduleTypeScheme = z.union([
  z.literal('closed'),
  z.literal('setup'),
  z.literal('lesson'),
  z.literal('etc'),
]);

export const scheduleScheme = z.object({
  id: z.string(),
  type: scheduleTypeScheme,
  reason: z.union([z.string(), z.null()]).optional(),
  is_regular: z.boolean().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  created_at: z.coerce.date(),
});

export const schedulesScheme = z.array(scheduleScheme);
