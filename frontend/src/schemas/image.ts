import { z } from 'zod';

export const imageTypeScheme = z.union([z.literal('interior'), z.literal('shower'), z.literal('thumbnail')]);

export const imageScheme = z.object({
  id: z.string(),
  url: z.string(),
  source: z.string().nullable(),
  type: imageTypeScheme,
  order: z.number(),
  created_at: z.coerce.date(),
});

export const imagesScheme = z.array(imageScheme);
