import { useContext } from 'react';

import { useMutateCragWebsiteUrl } from '@/hooks';

import { cragFormContext } from '@/pages/manage/Crags/CragForm/index.context';

import { Molecules } from '@/components/molecules';

export function CragWebsiteUrlField() {
  const { crag, revalidateCrag } = useContext(cragFormContext);

  const { changeCragWebsiteUrlMutation } = useMutateCragWebsiteUrl({
    onSettled() {
      revalidateCrag();
    },
  });

  const handleTextFieldUpdate = async (newValue: string) => {
    changeCragWebsiteUrlMutation.mutate({
      cragId: crag.id,
      websiteUrl: newValue,
    });
  };

  // BUG: website_url이 null일 경우 암장이 전환되도 이전 상태가 유지됨
  return (
    <Molecules.AutoSaveTextField value={crag.website_url || ''} onSave={handleTextFieldUpdate} label="웹 사이트 링크" />
  );
}
