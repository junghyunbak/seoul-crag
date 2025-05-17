import { z } from 'zod';

export const NoticeScheme = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  category: z.enum(['general', 'update']),
  isPinned: z.boolean(),
  visible: z.boolean(),
  createdAt: z.coerce.date(),
});

export const NoticesScheme = z.array(NoticeScheme);
