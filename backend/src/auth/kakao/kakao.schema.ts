import { z } from 'zod';

export const KakaoRawProfileSchema = z.object({
  properties: z
    .object({
      nickname: z.string().optional(),
      profile_image: z.string().optional(),
      thumbnail_image: z.string().optional(),
    })
    .optional(),
  kakao_account: z
    .object({
      email: z.string().email().optional(),
    })
    .optional(),
});

export type KakaoRawProfile = z.infer<typeof KakaoRawProfileSchema>;
