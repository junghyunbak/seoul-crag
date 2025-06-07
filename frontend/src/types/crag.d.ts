import { cragScheme } from '@/schemas';

import { z } from 'zod';

declare global {
  type SortOption = 'distance' | 'newest' | 'size' | 'remove' | 'recentSetting';

  type Filter = {
    isShower: boolean;
    isNonSetting: boolean;
    isNewSetting: boolean;
    isTodayRemove: boolean;
    isOuterWall: boolean;
    isOpen: boolean;
    isSale: boolean;
  };

  type Crag = z.infer<typeof cragScheme>;

  type CrewCount = 1 | 5 | 10;
}
