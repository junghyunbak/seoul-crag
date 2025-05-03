import { z } from 'zod';

export const scheduleTypeScheme = z.union([z.literal('closed'), z.literal('setup'), z.literal('reduced')]);
export const timeYYYYMMDDTHHMMSSScheme = z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);

export const scheduleScheme = z.object({
  id: z.string(),
  type: scheduleTypeScheme,
  open_date: z.union([timeYYYYMMDDTHHMMSSScheme, z.null()]),
  close_date: z.union([timeYYYYMMDDTHHMMSSScheme, z.null()]),
  created_at: z.coerce.date(),
});

export const schedulesScheme = z.array(scheduleScheme);
