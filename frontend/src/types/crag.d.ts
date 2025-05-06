import { cragScheme } from '@/schemas';

import { z } from 'zod';

declare global {
  type SortOption = 'distance' | 'newest' | 'size';

  type Crag = z.infer<typeof cragScheme>;
}
