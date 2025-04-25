import { z } from 'zod';

import { rolesScheme } from '@/schemas/role';

export const userScheme = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().optional(),
  profile_image: z.string().optional(),
  created_at: z.coerce.date(),
  roles: rolesScheme,
});

export const usersScheme = z.array(userScheme);
