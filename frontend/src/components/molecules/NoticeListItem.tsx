import { useState } from 'react';

import { Box, Typography } from '@mui/material';

import { Atoms } from '@/components/atoms';

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

interface NoticeListItemProps {
  initialExpanded?: boolean;
  notice: Notice;
}

export function NoticeListItem({ initialExpanded, notice }: NoticeListItemProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  return (
    <Atoms.Accordion.Square key={notice.id} expanded={isExpanded} onChange={() => setIsExpanded((prev) => !prev)}>
      <Atoms.Accordion.SquareSummary>
        <Typography variant="h6">{`${notice.isPinned ? '📌 ' : ''}${notice.title}`}</Typography>
      </Atoms.Accordion.SquareSummary>

      <Atoms.Accordion.SquareDetails>
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
      </Atoms.Accordion.SquareDetails>
    </Atoms.Accordion.Square>
  );
}
