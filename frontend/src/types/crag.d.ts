import { cragScheme } from '@/schemas';

import { z } from 'zod';

declare global {
  type SortOption = 'distance' | 'newest' | 'size';

  type Filter = {
    date: Date | null;
    isShower: boolean;
    isNonSetting: boolean;
    isNewSetting: boolean;
    isTodayRemove: boolean;
  };

  type Crag = z.infer<typeof cragScheme>;
}
