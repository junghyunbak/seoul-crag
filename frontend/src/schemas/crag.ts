import { dateScheme } from '@/schemas/common/date';
import { imageScheme } from '@/schemas/image';
import { openingHourScheme } from '@/schemas/openingHour';
import { scheduleScheme } from '@/schemas/schedule';
import { TagScheme } from '@/schemas/tag';
import { z } from 'zod';
import { InternalUserSchema } from './user';
import { contributionSchema } from './contribute';

export const InternalCragSchema = z.object({
  id: z.string(),
  name: z.string(),
  short_name: z.string().nullable(),
  description: z.string(),
  latitude: z.number(),
  longitude: z.number(),

  thumbnail_url: z.string().nullable(),
  website_url: z.string().nullable(),
  shower_url: z.string().nullable(),
  area: z.number().nullable(),
  is_outer_wall: z.boolean(),

  opened_at: z.union([dateScheme, z.null()]).optional(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export const InternalCragRelationSchema = z.object({
  images: z.array(imageScheme),
  schedules: z.array(scheduleScheme),
  openingHours: z.array(openingHourScheme),
  gymTags: z.array(z.object({ id: z.string().uuid(), tag: TagScheme, created_at: z.coerce.date() })),
  gymUserContributions: z.array(
    z.object({
      id: z.string().uuid(),
      description: z.string(),
      contribution: contributionSchema,
      created_at: z.coerce.date(),
      user: z.lazy(() => InternalUserSchema),
    })
  ),
});

export const cragScheme = z.lazy(() => InternalCragSchema.merge(InternalCragRelationSchema));
