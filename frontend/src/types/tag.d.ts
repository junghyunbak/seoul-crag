import { TagTypeScheme, TagScheme } from '@/schemas/tag';

import { z } from 'zod';

declare global {
  type TagType = z.infer<typeof TagTypeScheme>;
  type Tag = z.infer<typeof TagScheme>;
}
