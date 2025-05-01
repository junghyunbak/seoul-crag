import { userScheme } from '@/schemas/user';
import { z } from 'zod';

export const commentScheme = z.object({
  id: z.string().uuid(),
  content: z.string(),
  is_admin_only: z.boolean(),
  user: userScheme.omit({ roles: true }),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export const commentsScheme = z.array(commentScheme);
