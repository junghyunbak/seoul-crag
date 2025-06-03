import { useFetchNotices, useModifyNotice, useNotice } from '@/hooks';

import { Modal, Box, Divider, IconButton, Grow } from '@mui/material';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import { Molecules } from '@/components/molecules';
import { Atoms } from '@/components/atoms';

export function Notice() {
  const { notices } = useFetchNotices(true);

  const { isNoticeOpen } = useNotice();

  const { updateIsNoticeOpen, updateReadNoticeIds } = useModifyNotice();

  const handleModalClose = () => {
    updateReadNoticeIds((notices || []).map((notice) => notice.id));
    updateIsNoticeOpen(false);
  };

  return (
    <Modal open={isNoticeOpen} onClose={handleModalClose} slots={{ backdrop: () => null }}>
      <Grow in={isNoticeOpen}>
        <Box
          sx={(theme) => ({
            width: '100%',
            height: '100%',
            bgcolor: theme.palette.background.paper,
            outline: 'none',
            position: 'relative',
            overflowY: 'auto',
          })}
          tabIndex={-1}
        >
          <Box
            sx={(theme) => ({
              position: 'sticky',
              top: 0,
              zIndex: 1,
              background: theme.palette.background.paper,
            })}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                gap: 1,
              }}
            >
              <IconButton onClick={handleModalClose}>
                <ArrowBackIosNewIcon />
              </IconButton>

              <Atoms.Text.Title variant="h6">공지사항</Atoms.Text.Title>
            </Box>

            <Divider />
          </Box>

          {notices && <Molecules.NoticeList notices={notices} />}
        </Box>
      </Grow>
    </Modal>
  );
}
