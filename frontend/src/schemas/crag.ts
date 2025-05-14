import { dateScheme } from '@/schemas/common/date';
import { imageTypeScheme } from '@/schemas/image';
import { openingHoursScheme } from '@/schemas/openingHour';
import { schedulesScheme } from '@/schemas/schedule';
import { TagsScheme } from '@/schemas/tag';
import { z } from 'zod';

// [ ]: 불필요한 optional 제거
export const cragScheme = z.object({
  id: z.string(),
  name: z.string(),
  short_name: z.union([z.string(), z.null()]),
  description: z.string(),
  latitude: z.number(),
  longitude: z.number(),

  thumbnail_url: z.union([z.string(), z.null()]).optional(),
  website_url: z.union([z.string(), z.null()]),
  shower_url: z.string(),
  area: z.union([z.number(), z.null()]).optional(),
  is_outer_wall: z.boolean(),

  imageTypes: z.union([z.array(imageTypeScheme), z.null()]).optional(),
  futureSchedules: z.union([schedulesScheme, z.null()]).optional(),
  openingHourOfWeek: z.union([openingHoursScheme, z.null()]).optional(),
  tags: TagsScheme.optional(),

  opened_at: z.union([dateScheme, z.null()]).optional(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export const cragsScheme = z.array(cragScheme);
