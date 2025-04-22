import { userScheme } from '@/schemas';

import { z } from 'zod';

declare global {
  type User = z.infer<typeof userScheme>;
}
