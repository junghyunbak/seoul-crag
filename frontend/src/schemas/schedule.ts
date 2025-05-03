import { z } from 'zod';
import { dateTimeScheme } from '@/schemas/common/date';

export const scheduleTypeScheme = z.union([z.literal('closed'), z.literal('setup'), z.literal('reduced')]);

export const scheduleScheme = z.object({
  id: z.string(),
  type: scheduleTypeScheme,
  open_date: dateTimeScheme,
  close_date: dateTimeScheme,
  created_at: z.coerce.date(),
});

export const schedulesScheme = z.array(scheduleScheme);
