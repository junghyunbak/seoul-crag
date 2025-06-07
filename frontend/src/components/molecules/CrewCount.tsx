import { Box, Paper, Typography } from '@mui/material';

import { Atoms } from '@/components/atoms';

import { useCrewCount, useModifyCrewCount } from '@/hooks';

export function CrewCount() {
  const { crewCount } = useCrewCount();

  const { rotateCrewCount } = useModifyCrewCount();

  return (
    <Paper
      sx={{
        p: 0.5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 0.4,
        height: 50,
        aspectRatio: '1/1',
        cursor: 'pointer',
      }}
      onClick={() => {
        rotateCrewCount();
      }}
    >
      <Atoms.Text.Title variant="caption">인원</Atoms.Text.Title>
      <Box
        sx={(theme) => ({
          px: 0.5,
          background: `${theme.palette.info.light}aa`,
          display: 'flex',
          justifyContent: 'center',
          borderRadius: 0.5,
          width: '100%',
        })}
      >
        <Typography
          variant="body2"
          sx={(theme) => ({
            color: theme.palette.info.dark,
            fontWeight: 'bold',
          })}
        >
          {crewCount === 1 ? '개인' : crewCount}
        </Typography>
      </Box>
    </Paper>
  );
}
