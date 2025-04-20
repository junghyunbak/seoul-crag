import { z } from 'zod';

export const imageTypeScheme = z.union([z.literal('interior'), z.literal('shower')]);

export const imageScheme = z.object({
  id: z.string(),
  url: z.string(),
  type: imageTypeScheme,
  order: z.number(),
  created_at: z.coerce.date(),
});

export const imagesScheme = z.array(imageScheme);
