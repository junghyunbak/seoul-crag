import { useContext } from 'react';

import { FormTextField } from '@/components/FormTextField';

import { cragFormContext } from '@/pages/manage/Crags/CragForm/index.context';

import { useMutateCragShortName } from '@/hooks';

export function CragShortNameField() {
  const { crag, revalidateCrag } = useContext(cragFormContext);

  const { changeCragShortNameMutation } = useMutateCragShortName({
    onSettled() {
      revalidateCrag();
    },
  });

  const handleTextFieldUpdate = async (newValue: string) => {
    changeCragShortNameMutation.mutate({
      cragId: crag.id,
      name: newValue,
    });
  };

  return <FormTextField value={crag.short_name || ''} onSave={handleTextFieldUpdate} label="암장 별칭 (짧은 이름)" />;
}
