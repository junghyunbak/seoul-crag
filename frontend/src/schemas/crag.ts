import { imageTypeScheme } from '@/schemas/image';
import { openingHoursScheme } from '@/schemas/openingHour';
import { schedulesScheme } from '@/schemas/schedule';
import { z } from 'zod';

export const cragScheme = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  thumbnail_url: z.union([z.string(), z.null()]).optional(),
  area: z.union([z.number(), z.null()]).optional(),
  imageTypes: z.union([z.array(imageTypeScheme), z.null()]).optional(),
  futureSchedules: z.union([schedulesScheme, z.null()]).optional(),
  openingHourOfWeek: z.union([openingHoursScheme, z.null()]).optional(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export const cragsScheme = z.array(cragScheme);
