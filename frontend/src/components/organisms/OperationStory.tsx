import { createPortal } from 'react-dom';

import { useQueryParam, StringParam } from 'use-query-params';

import { Box, Typography, styled } from '@mui/material';

import { QUERY_STRING, TIME } from '@/constants';

import { useExp, useFetchCrag, useFilter } from '@/hooks';

import { AnimatePresence } from 'framer-motion';

import { addDays, format } from 'date-fns';

import { Molecules } from '@/components/molecules';

export function OperationStory() {
  const [operationStoryCragId, setOperationStory] = useQueryParam(QUERY_STRING.STORY_OPERATION, StringParam);

  const { crag } = useFetchCrag({ cragId: operationStoryCragId });

  const { exp } = useExp();

  return createPortal(
    <AnimatePresence>
      {operationStoryCragId && crag && (
        <Molecules.Story
          crag={crag}
          contents={Array(7)
            .fill(null)
            .map((_, i) => {
              const date = addDays(exp.date, i);

              return <StoryOperationPage key={i} crag={crag} date={date} />;
            })}
          onClose={() => setOperationStory(null)}
          onComplete={() => setOperationStory(null)}
          initPaused
        />
      )}
    </AnimatePresence>,
    document.body
  );
}

const TextWithBg = styled(Typography)({
  fontWeight: 'bold',
  fontStyle: 'italic',
  fontFamily: 'synthese-boldoblique',
  background: '#f25360',
  color: 'white',
  padding: '2%',
});

const Text = styled(Typography)({
  fontWeight: 'bold',
  fontStyle: 'italic',
  fontFamily: 'synthese-boldoblique',
  color: 'white',
  padding: '2%',
});

interface StoryOperationPageProps {
  crag: Crag;
  date: Date;
}

export function StoryOperationPage({ crag, date }: StoryOperationPageProps) {
  const { open, close, isReduced, isTemporaryClosed, isOperate } = useFilter(crag, date);

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1,
          background: 'linear-gradient(57deg,rgba(234, 115, 128, 1) 0%, rgba(240, 221, 213, 1) 100%)',
        }}
      >
        <Text variant="h2">{format(date, 'yyyy.MM.dd')}</Text>

        <Text variant="h2">{TIME.DAYS_OF_KOR[date.getDay()]}</Text>

        {isOperate ? (
          <>
            <TextWithBg variant="h3" sx={{ color: isReduced ? 'yellow' : 'white' }}>{`${format(
              open.date,
              'a hh:mm'
            )} ~`}</TextWithBg>

            <TextWithBg
              variant="h3"
              sx={{
                color: isReduced ? 'yellow' : 'white',
              }}
            >{`${format(close.date, 'a hh:mm')}`}</TextWithBg>
          </>
        ) : (
          <TextWithBg variant="h2">{`${isTemporaryClosed ? '임시' : '정기'} 휴일`}</TextWithBg>
        )}
      </Box>
    </Box>
  );
}
