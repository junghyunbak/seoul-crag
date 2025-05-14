import { z } from 'zod';

export const TagTypeScheme = z.union([z.literal('climb'), z.literal('board'), z.literal('location')]);

export const TagScheme = z.object({
  id: z.string().uuid(),
  name: z.string(),
  type: TagTypeScheme,
  created_at: z.coerce.date(),
});

export const TagsScheme = z.array(TagScheme);
