import { z } from 'zod';

export const imageScheme = z.object({
  id: z.string(),
  url: z.string(),
  type: z.string(),
  order: z.number(),
  created_at: z.coerce.date(),
});

export const imagesScheme = z.array(imageScheme);
