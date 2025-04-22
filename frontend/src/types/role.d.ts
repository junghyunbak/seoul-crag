import { roleScheme } from '@/schemas';

import { z } from 'zod';

declare global {
  type Role = z.infer<typeof roleScheme>;
}
