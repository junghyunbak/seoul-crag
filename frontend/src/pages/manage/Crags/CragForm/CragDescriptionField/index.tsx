import { useContext } from 'react';

import { FormTextField } from '@/components/FormTextField';

import { cragFormContext } from '@/pages/manage/Crags/CragForm/index.context';

import { api } from '@/api/axios';

export function CragDescriptionField() {
  const { crag, revalidateCrag } = useContext(cragFormContext);

  const handleTextFieldUpdate = async (newValue: string) => {
    await api.patch(`/gyms/${crag.id}`, {
      description: newValue,
    });

    revalidateCrag();
  };

  return <FormTextField value={crag.description} onSave={handleTextFieldUpdate} label="암장 소개" multilineCount={3} />;
}
