import { z } from 'zod';

import { timeSchema } from '@/schemas/common/date';

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
  open_time: timeSchema,
  close_time: timeSchema,
  is_closed: z.boolean(),
});

export const openingHoursScheme = z.array(openingHourScheme);
