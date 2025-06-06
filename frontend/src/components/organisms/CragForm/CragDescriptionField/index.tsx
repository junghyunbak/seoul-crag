import { useContext } from 'react';

import { cragFormContext } from '@/components/organisms/CragForm/index.context';

import { useMutateCragDescription } from '@/hooks';

import { Molecules } from '@/components/molecules';

export function CragDescriptionField() {
  const { crag, revalidateCrag } = useContext(cragFormContext);

  const { changeCragDescriptionMutation } = useMutateCragDescription({
    onSettled() {
      revalidateCrag();
    },
  });

  const handleTextFieldUpdate = async (newValue: string) => {
    changeCragDescriptionMutation.mutate({
      cragId: crag.id,
      description: newValue,
    });
  };

  return (
    <Molecules.AutoSaveTextField
      value={crag.description}
      onSave={handleTextFieldUpdate}
      label="암장 소개"
      multilineCount={3}
    />
  );
}
