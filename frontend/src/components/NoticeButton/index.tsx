import { Badge, Button, IconButton } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

import { useFetchNotices, useModifyNotice, useNotice } from '@/hooks';

export function NoticeButton() {
  const { notices } = useFetchNotices(true);

  const { readNoticeIds } = useNotice();

  const { updateIsNoticeOpen } = useModifyNotice();

  const noticeCount = (notices || []).filter((notice) => !readNoticeIds.includes(notice.id)).length;

  return (
    <IconButton
      onClick={() => {
        updateIsNoticeOpen(true);
      }}
    >
      <Badge badgeContent={noticeCount} color="error">
        <NotificationsNoneIcon />
      </Badge>
    </IconButton>
  );
}
