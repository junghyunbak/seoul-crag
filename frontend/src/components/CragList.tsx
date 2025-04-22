/*
import { Box, Card, CardContent, CardMedia, Stack, Typography } from '@mui/material';

import { useCrag, useExerciseTimeRange, useSelectDate } from '@/hooks';

import { Sheet } from 'react-modal-sheet';

export function CragList() {
  const { selectDate } = useSelectDate();
  const { exerciseTimeRange } = useExerciseTimeRange();
  const { filteredCrags } = useCrag(selectDate, exerciseTimeRange);

  return (
    <Sheet isOpen onClose={() => {}} snapPoints={[0.9, 0.3, 40]} initialSnap={2}>
      <Sheet.Container>
        <Sheet.Header>
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ position: 'absolute', bottom: '100%', width: '100%', p: '1rem' }}>
              <Box sx={{}}>테스트</Box>
            </Box>
            <Sheet.Header />
          </Box>
        </Sheet.Header>
        <Sheet.Content disableDrag>
          <Box sx={{ p: '1rem' }}>
            <Stack gap="1rem">
              {filteredCrags.map((crag) => {
                return <CragItem crag={crag} key={crag.id} />;
              })}
            </Stack>
          </Box>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}

interface CragItemProps {
  crag: Crag;
}

function CragItem({ crag }: CragItemProps) {
  return (
    <Card sx={{ display: 'flex' }}>
      <CardMedia component="img" image={crag.thumbnailImageUrl} sx={{ width: '30%' }} />
      <CardContent>
        <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{crag.name}</Typography>
        <Typography
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '2',
            WebkitBoxOrient: 'vertical',
          }}
        >
          {crag.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
*/
