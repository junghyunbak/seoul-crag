import { commentScheme } from '@/schemas/comment';
import { z } from 'zod';

declare global {
  type CragComment = z.infer<typeof commentScheme>;
}
