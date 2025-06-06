import { useMutateCragOuterWall } from '@/hooks';
import { cragFormContext } from '@/components/organisms/CragForm/index.context';
import { Checkbox, FormControlLabel } from '@mui/material';
import { useContext } from 'react';

export function CragOuterWallField() {
  const { crag, revalidateCrag } = useContext(cragFormContext);

  const { changeCragOuterWallMutation } = useMutateCragOuterWall();

  return (
    <FormControlLabel
      sx={{
        width: 'fit-content',
      }}
      control={
        <Checkbox
          checked={crag.is_outer_wall}
          onChange={(e) =>
            changeCragOuterWallMutation.mutate(
              { cragId: crag.id, isOuterWall: e.target.checked },
              {
                onSettled() {
                  revalidateCrag();
                },
              }
            )
          }
        />
      }
      label="외벽 타입"
    />
  );
}
