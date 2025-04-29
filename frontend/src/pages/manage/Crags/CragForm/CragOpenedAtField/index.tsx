import { useContext, useEffect, useState } from 'react';

import { useMutateCragOpenedAtUpdate } from '@/hooks';

import { TextField } from '@mui/material';

import { cragFormContext } from '@/pages/manage/Crags/CragForm/index.context';
import { format } from 'date-fns';

export function CragOpenedAtField() {
  const [openedAtValue, setOpenedAtValue] = useState('');

  const { crag, revalidateCrag } = useContext(cragFormContext);

  useEffect(() => {
    if (crag.opened_at) {
      setOpenedAtValue(crag.opened_at);
    } else {
      setOpenedAtValue(format(new Date(), 'yyyy-MM-dd'));
    }
  }, [crag]);

  const { cragOpenedAtUpdateMutation } = useMutateCragOpenedAtUpdate({
    onSettled() {
      revalidateCrag();
    },
  });

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;

    setOpenedAtValue(value);

    cragOpenedAtUpdateMutation.mutate({ cragId: crag.id, openedAt: value });
  };

  return (
    <TextField
      label="개설일"
      type="date"
      value={openedAtValue}
      onChange={handleOnChange}
      InputLabelProps={{
        shrink: true,
      }}
    />
  );
}
