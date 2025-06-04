import { z } from 'zod';

export const cafeSchema = z.object({
  id: z.string(),
  place_name: z.string(),
  place_url: z.string(),
  y: z.string(),
  x: z.string(),
  distance: z.string(),
});

export const cafesSchema = z.array(cafeSchema);
