import { z } from 'zod';

export const imageTypeScheme = z.union([z.literal('interior'), z.literal('shower')]);

export const imageScheme = z.object({
  id: z.string(),
  url: z.string(),
  source: z.union([z.string(), z.null()]).optional(),
  type: imageTypeScheme,
  order: z.number(),
  created_at: z.coerce.date(),
});

export const imagesScheme = z.array(imageScheme);
