import { useContext } from 'react';

import { cragFormContext } from '@/components/organisms/CragForm/index.context';

import { useMutateCragShortName } from '@/hooks';
import { Molecules } from '@/components/molecules';

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

  return (
    <Molecules.AutoSaveTextField
      value={crag.short_name || ''}
      onSave={handleTextFieldUpdate}
      label="암장 별칭 (짧은 이름)"
    />
  );
}
