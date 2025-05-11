import { FormTextField } from '@/components/FormTextField';
import { useMutateCragShowerUrl } from '@/hooks';
import { cragFormContext } from '@/pages/manage/Crags/CragForm/index.context';
import { useContext } from 'react';

export function CragShowerUrlField() {
  const { crag, revalidateCrag } = useContext(cragFormContext);

  const { changeCragShowerUrlMutation } = useMutateCragShowerUrl();

  return (
    <FormTextField
      value={crag.shower_url}
      onSave={async (newValue: string) => {
        changeCragShowerUrlMutation.mutate(
          { cragId: crag.id, showerUrl: newValue },
          {
            onSettled() {
              revalidateCrag();
            },
          }
        );
      }}
      label="샤워실 블로그 링크"
    />
  );
}
