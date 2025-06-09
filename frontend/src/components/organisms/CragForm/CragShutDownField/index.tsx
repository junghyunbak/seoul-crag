import { cragFormContext } from '@/components/organisms/CragForm/index.context';
import { useMutationCrag } from '@/hooks';
import { Checkbox, FormControlLabel } from '@mui/material';
import { useContext } from 'react';

export function CragShutDownField() {
  const { crag, revalidateCrag } = useContext(cragFormContext);

  const { patchCragMutation } = useMutationCrag();

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={crag.is_shut_down}
          onChange={async (e) => {
            await patchCragMutation.mutateAsync({ id: crag.id, is_shut_down: e.target.checked });

            revalidateCrag();
          }}
        />
      }
      label="폐업 여부"
    />
  );
}
