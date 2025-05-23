import { z } from 'zod';

export const contributionSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  created_at: z.coerce.date(),
});

export const contributionsSchema = z.array(contributionSchema);
