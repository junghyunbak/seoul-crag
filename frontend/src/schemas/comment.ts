import { userSchema } from '@/schemas/user';
import { z } from 'zod';

export const commentScheme = z.object({
  id: z.string().uuid(),
  content: z.string(),
  is_admin_only: z.boolean(),
  user: userSchema,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export const commentsScheme = z.array(commentScheme);
