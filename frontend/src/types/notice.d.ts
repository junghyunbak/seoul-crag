import { NoticeScheme } from '@/schemas/notice';

import { z } from 'zod';

declare global {
  type Notice = z.infer<typeof NoticeScheme>;
}
