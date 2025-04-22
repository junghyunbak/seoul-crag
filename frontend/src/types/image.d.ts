import { imageScheme, imageTypeScheme } from '@/schemas';

import { z } from 'zod';

declare global {
  type Image = z.infer<typeof imageScheme>;
  type ImageType = z.infer<typeof imageTypeScheme>;
}
