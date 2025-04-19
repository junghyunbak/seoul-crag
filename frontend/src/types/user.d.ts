import { userScheme } from '@/schemas/role';

import { z } from 'zod';

declare global {
  type User = z.infer<typeof userScheme>;
}
