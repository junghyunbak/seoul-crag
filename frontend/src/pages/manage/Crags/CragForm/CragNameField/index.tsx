import { useContext } from 'react';

import { FormTextField } from '@/components/FormTextField';

import { cragFormContext } from '@/pages/manage/Crags/CragForm/index.context';

import { api } from '@/api/axios';

export function CragNameField() {
  const { crag, revalidateCrag } = useContext(cragFormContext);

  const handleTextFieldUpdate = async (newValue: string) => {
    await api.patch(`/gyms/${crag.id}`, {
      name: newValue,
    });

    revalidateCrag();
  };

  return <FormTextField value={crag.name} onSave={handleTextFieldUpdate} label="암장 이름" />;
}
