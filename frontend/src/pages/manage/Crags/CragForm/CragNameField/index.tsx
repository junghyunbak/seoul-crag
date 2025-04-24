import { useContext } from 'react';

import { FormTextField } from '@/components/FormTextField';

import { cragFormContext } from '@/pages/manage/Crags/CragForm/index.context';

import { useMutateCragName } from '@/hooks';

export function CragNameField() {
  const { crag, revalidateCrag } = useContext(cragFormContext);

  const { changeCragNameMutation } = useMutateCragName({
    onSettled() {
      revalidateCrag();
    },
  });

  const handleTextFieldUpdate = async (newValue: string) => {
    changeCragNameMutation.mutate({
      cragId: crag.id,
      name: newValue,
    });
  };

  return <FormTextField value={crag.name} onSave={handleTextFieldUpdate} label="암장 이름" />;
}
