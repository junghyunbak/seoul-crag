import { z } from 'zod';
import { cafeSchema } from '@/schemas/cafe';

declare global {
  type Cafe = z.infer<typeof cafeSchema>;
}
