import { z } from 'zod';

export const dateTimeScheme = z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);

export const dateScheme = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, '시간 형식은 HH:mm:ss이어야 합니다');
