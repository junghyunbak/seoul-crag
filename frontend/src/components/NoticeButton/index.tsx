import { Badge, Button } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

import { useFetchNotices, useModifyNotice, useNotice } from '@/hooks';

export function NoticeButton() {
  const { notices } = useFetchNotices(true);

  const { readNoticeIds } = useNotice();

  const { updateIsNoticeOpen } = useModifyNotice();

  const noticeCount = (notices || []).filter((notice) => !readNoticeIds.includes(notice.id)).length;

  return (
    <Button
      sx={(theme) => ({
        background: theme.palette.common.white,
        p: 1.5,
        minWidth: 'auto',
        aspectRatio: '1/1',
        boxShadow: 1,
      })}
      onClick={() => {
        updateIsNoticeOpen(true);
      }}
    >
      <Badge badgeContent={noticeCount} color="error">
        <NotificationsNoneIcon />
      </Badge>
    </Button>
  );
}
