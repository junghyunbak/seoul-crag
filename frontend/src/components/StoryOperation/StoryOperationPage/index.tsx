import { Box, Typography, styled } from '@mui/material';

import { format } from 'date-fns';

import { DAYS_OF_KOR } from '@/constants/time';

import { useFilter } from '@/hooks';

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
  const { open, close, isReduced, isRegularyClosed, isTemporaryClosed } = useFilter(crag, date);

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
        <Text variant="h2">{DAYS_OF_KOR[date.getDay()]}</Text>
        {isRegularyClosed ? (
          <TextWithBg variant="h2">정기 휴일</TextWithBg>
        ) : isTemporaryClosed ? (
          <TextWithBg variant="h2">임시 휴일</TextWithBg>
        ) : (
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
        )}
      </Box>
    </Box>
  );
}
