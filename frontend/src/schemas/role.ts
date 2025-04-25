import { z } from 'zod';

export const roleScheme = z.object({
  id: z.string(),
  name: z.enum(['owner', 'gym_admin', 'partner_admin']),
});

export const rolesScheme = z.array(roleScheme);
