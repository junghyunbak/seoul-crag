import { roleScheme } from '@/schemas/user';

import { z } from 'zod';

declare global {
  type Role = z.infer<typeof roleScheme>;
}
