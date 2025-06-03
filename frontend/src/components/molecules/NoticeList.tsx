import { Box } from '@mui/material';

import { useNotice } from '@/hooks';

import { isAfter } from 'date-fns';
import { Molecules } from '@/components/molecules';

export function NoticeList({ notices }: { notices: Notice[] }) {
  const { readNoticeIds } = useNotice();

  return (
    <Box sx={{ p: 2 }}>
      {(notices || [])
        .sort((a, b) => {
          if (a.isPinned && !b.isPinned) {
            return -1;
          } else if (!a.isPinned && b.isPinned) {
            return 1;
          } else {
            return isAfter(a.createdAt, b.createdAt) ? -1 : 1;
          }
        })
        .map((notice) => {
          const initialExpanded = (() => {
            /*
            if (notice.isPinned) {
              return true;
            }
            */

            const isRead = readNoticeIds.includes(notice.id);

            return !isRead;
          })();

          return <Molecules.NoticeListItem key={notice.id} initialExpanded={initialExpanded} notice={notice} />;
        })}
    </Box>
  );
}
