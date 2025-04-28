import { useContext } from 'react';

import { useMutateCragWebsiteUrl } from '@/hooks';

import { FormTextField } from '@/components/FormTextField';
import { cragFormContext } from '@/pages/manage/Crags/CragForm/index.context';

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

  return <FormTextField value={crag.website_url} onSave={handleTextFieldUpdate} label="웹 사이트 링크" />;
}
