import { useContext } from 'react';

import { FormTextField } from '@/components/FormTextField';

import { cragFormContext } from '@/pages/manage/Crags/CragForm/index.context';

import { api } from '@/api/axios';

import { useMutation } from '@tanstack/react-query';

export function CragNameField() {
  const { crag, revalidateCrag } = useContext(cragFormContext);

  const { mutate } = useMutation({
    mutationFn: async (name: string) => {
      await api.patch(`/gyms/${crag.id}`, {
        name,
      });
    },
    onSettled() {
      revalidateCrag();
    },
  });

  const handleTextFieldUpdate = async (newValue: string) => {
    mutate(newValue);
  };

  return <FormTextField value={crag.name} onSave={handleTextFieldUpdate} label="암장 이름" />;
}
