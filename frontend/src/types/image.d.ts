import { imageScheme } from '@/schemas/image';

import { z } from 'zod';

declare global {
  type Image = z.infer<typeof imageScheme>;
  type ImageType = 'interior' | 'thumbnail';
}
