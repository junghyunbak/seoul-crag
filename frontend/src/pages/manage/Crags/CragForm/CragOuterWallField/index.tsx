import { useMutateCragOuterWall } from '@/hooks';
import { cragFormContext } from '@/pages/manage/Crags/CragForm/index.context';
import { Checkbox, FormControlLabel } from '@mui/material';
import { useContext } from 'react';

export function CragOuterWallField() {
  const { crag, revalidateCrag } = useContext(cragFormContext);

  const { changeCragOuterWallMutation } = useMutateCragOuterWall();

  return (
    <FormControlLabel
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
