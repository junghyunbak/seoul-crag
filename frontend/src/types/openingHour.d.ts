import { openingHourScheme } from '@/schemas';

import { z } from 'zod';

declare global {
  type OpeningHour = z.infer<typeof openingHourScheme>;
  type OpeningHourDayType = z.infer<typeof openingHourScheme>['day'];
}
