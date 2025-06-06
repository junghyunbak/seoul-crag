import { useContext } from 'react';

import { cragFormContext } from '@/pages/manage/Crags/CragForm/index.context';

import { useMutationCrag } from '@/hooks';

import { Molecules } from '@/components/molecules';

export function CragPriceField() {
  const { crag, revalidateCrag } = useContext(cragFormContext);

  const { patchCragMutation } = useMutationCrag();

  const handleAreaFieldUpdate = async (data: string) => {
    const price = +data;

    if (isNaN(price)) {
      throw new Error();
    }

    await patchCragMutation.mutateAsync({ id: crag.id, price });

    revalidateCrag();
  };

  return (
    <Molecules.AutoSaveTextField value={crag.price.toString()} label="1일권 가격" onSave={handleAreaFieldUpdate} />
  );
}
