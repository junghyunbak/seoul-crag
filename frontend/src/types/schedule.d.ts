import { scheduleScheme, scheduleTypeScheme } from '@/schemas';

import { z } from 'zod';

declare global {
  type Schedule = z.infer<typeof scheduleScheme>;
  type ScheduleType = z.infer<typeof scheduleTypeScheme>;
}
