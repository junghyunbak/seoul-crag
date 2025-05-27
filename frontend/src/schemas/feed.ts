import { z } from 'zod';

export const feedSchema = z.object({
  id: z.string().uuid(),
  url: z.string().url(),
  is_read: z.boolean(),
  thumbnail_url: z.string(), // 빈 문자열일 수 있어 url() 대신 string() 사용
  created_at: z.coerce.date(),
});

declare global {
  type Feed = z.infer<typeof feedSchema>;
}
