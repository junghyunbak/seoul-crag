import { useFetchNotices, useModifyNotice, useNotice } from '@/hooks';

import { Modal, Box, Typography, Divider, IconButton, styled, Grow } from '@mui/material';

import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps, accordionSummaryClasses } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';

import { isAfter } from 'date-fns';
import { useState } from 'react';

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
  ({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&::before': {
      display: 'none',
    },
  })
);

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />} {...props} />
))(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]: {
    transform: 'rotate(90deg)',
  },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles('dark', {
    backgroundColor: 'rgba(255, 255, 255, .05)',
  }),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export function Notice() {
  const { notices } = useFetchNotices(true);

  const { readNoticeIds, isNoticeOpen } = useNotice();

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

              <Typography variant="h6" component="h2">
                공지사항
              </Typography>
            </Box>

            <Divider />
          </Box>

          <Box sx={{ p: 2 }}>
            {(notices || [])
              .sort((a, b) => {
                if (a.isPinned && !b.isPinned) return -1;

                return isAfter(a.createdAt, b.createdAt) ? -1 : 1;
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

                return <NoticeItem key={notice.id} initialExpanded={initialExpanded} notice={notice} />;
              })}
          </Box>
        </Box>
      </Grow>
    </Modal>
  );
}

interface NoticeItemProps {
  initialExpanded?: boolean;
  notice: Notice;
}

function NoticeItem({ initialExpanded, notice }: NoticeItemProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  return (
    <Accordion key={notice.id} expanded={isExpanded} onChange={() => setIsExpanded((prev) => !prev)}>
      <AccordionSummary>
        <Typography variant="h6">{`${notice.isPinned ? '📌 ' : ''}${notice.title}`}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          sx={(theme) => ({
            '& *': {
              whiteSpace: 'normal',
              wordBreak: 'break-all',
              fontFamily: theme.typography.fontFamily,
            },
            '& img': {
              maxWidth: '100%',
            },
          })}
        >
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>{notice.content}</ReactMarkdown>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
