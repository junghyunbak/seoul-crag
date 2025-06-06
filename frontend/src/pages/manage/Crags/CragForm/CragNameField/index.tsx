import { useContext } from 'react';

import { cragFormContext } from '@/pages/manage/Crags/CragForm/index.context';

import { useMutateCragName } from '@/hooks';

import { Molecules } from '@/components/molecules';

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

  return <Molecules.AutoSaveTextField value={crag.name} onSave={handleTextFieldUpdate} label="암장 이름" />;
}
