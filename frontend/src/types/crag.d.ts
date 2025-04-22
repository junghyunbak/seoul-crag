import { cragScheme } from '@/schemas';

import { z } from 'zod';

declare global {
  type Crag = z.infer<typeof cragScheme>;
}
