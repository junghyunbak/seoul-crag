import { z } from 'zod';
import { roleScheme } from '@/schemas/role';
import { InternalCragSchema } from './crag';

export const InternalUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().nullable(),
  profile_image: z.string().nullable(),
  created_at: z.coerce.date(),
});

export const InternalUserRelationSchema = z.object({
  userRoles: z.array(
    z.object({
      id: z.string().uuid(),
      role: roleScheme,
    })
  ),
  gymUserContributions: z.array(
    z.object({
      id: z.string().uuid(),
      description: z.string(),
      gym: InternalCragSchema,
      created_at: z.coerce.date(),
    })
  ),
});

declare global {
  type User = {
    id: string;
    username: string;
    email: string | null;
    profile_image: string | null;
    created_at: Date;
    userRoles: {
      id: string;
      role: z.infer<typeof roleScheme>;
    }[];
    gymUserContributions: {
      id: string;
      description: string;
      gym: z.infer<typeof InternalCragSchema>;
      created_at: Date;
    }[];
  };
}

export const userSchema: z.ZodType<User> = z.lazy(() => InternalUserSchema.merge(InternalUserRelationSchema));
