import { z } from 'zod';

const timeHHmmssSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, '시간 형식은 HH:mm:ss이어야 합니다');

export const openingHourScheme = z.object({
  id: z.string(),
  day: z.union([
    z.literal('sunday'),
    z.literal('monday'),
    z.literal('tuesday'),
    z.literal('wednesday'),
    z.literal('thursday'),
    z.literal('friday'),
    z.literal('saturday'),
  ]),
  open_time: z.union([timeHHmmssSchema, z.null()]).optional(),
  close_time: z.union([timeHHmmssSchema, z.null()]).optional(),
  is_closed: z.boolean(),
});

export const openingHoursScheme = z.array(openingHourScheme);
