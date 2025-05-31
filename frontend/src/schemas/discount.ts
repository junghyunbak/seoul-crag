import { dateScheme, timeSchema } from '@/schemas/common/date';
import { z } from 'zod';

export const GroupDiscountSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('group'),
  price: z.number().int(),
  description: z.string(),
  min_group_size: z.number().int().min(1),
});

export const TimeDiscountSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('time'),
  price: z.number().int(),
  description: z.string(),
  weekday: z.number().int().min(0).max(6),
  time_start: timeSchema,
  time_end: timeSchema,
});

export const EventDiscountSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('event'),
  price: z.number().int(),
  description: z.string(),
  date: dateScheme,
  time_start: timeSchema,
  time_end: timeSchema,
});

export const GymDiscountSchema = z.discriminatedUnion('type', [
  GroupDiscountSchema,
  TimeDiscountSchema,
  EventDiscountSchema,
]);

declare global {
  type GymDiscount = z.infer<typeof GymDiscountSchema>;
}
