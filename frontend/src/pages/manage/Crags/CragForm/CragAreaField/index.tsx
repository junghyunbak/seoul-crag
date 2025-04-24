import { useContext } from 'react';

import { FormTextField } from '@/components/FormTextField';

import { cragFormContext } from '@/pages/manage/Crags/CragForm/index.context';

import { useMutateCragArea } from '@/hooks';

const MIN_AREA_VALUE = 50;
const MAX_AREA_VALUE = 1000;

export function CragAreaField() {
  const { crag, revalidateCrag } = useContext(cragFormContext);

  const { changeCragAreaMutation } = useMutateCragArea({
    onSettled() {
      revalidateCrag();
    },
  });

  const handleAreaFieldUpdate = async (data: string) => {
    if (isNaN(+data) || !(MIN_AREA_VALUE <= +data && +data <= MAX_AREA_VALUE)) {
      throw new Error();
    }

    changeCragAreaMutation.mutate({
      cragId: crag.id,
      area: +data,
    });
  };

  return (
    <FormTextField
      value={crag.area?.toString()}
      label="암장 크기 (단위: 평)"
      placeholder={`최소: ${MIN_AREA_VALUE}, 최대: ${MAX_AREA_VALUE}`}
      helperText={`${MIN_AREA_VALUE}에서 ${MAX_AREA_VALUE} 사이의 평수를 입력해야합니다.`}
      onSave={handleAreaFieldUpdate}
    />
  );
}
