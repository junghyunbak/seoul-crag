import { scheduleScheme, scheduleTypeScheme } from '@/schemas/schedule';

import { z } from 'zod';

declare global {
  type Schedule = z.infer<typeof scheduleScheme>;
  type ScheduleType = z.infer<typeof scheduleTypeScheme>;
}
