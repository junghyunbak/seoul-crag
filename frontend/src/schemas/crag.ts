import { z } from 'zod';

export const cragScheme = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  thumbnail_url: z.string().optional(),
  area: z.union([z.number(), z.null()]).optional(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export const cragsScheme = z.array(cragScheme);
