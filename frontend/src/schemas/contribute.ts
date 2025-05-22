import { z } from 'zod';

export const contributionScheme = z.object({
  id: z.string().uuid(),
  name: z.string(),
  created_at: z.coerce.date(),
});

export const contributionsScheme = z.array(contributionScheme);
