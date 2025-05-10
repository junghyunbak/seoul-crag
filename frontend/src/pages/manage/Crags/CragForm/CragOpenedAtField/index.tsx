import { useContext, useEffect, useState } from 'react';

import { useMutateCragOpenedAtUpdate } from '@/hooks';

import { Box, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { cragFormContext } from '@/pages/manage/Crags/CragForm/index.context';

import DatePicker from 'react-datepicker';

import { ko } from 'date-fns/locale';
import { subYears } from 'date-fns';

import { DateService } from '@/utils/time';

export function CragOpenedAtField() {
  const [date, setDate] = useState(new Date());

  const { crag, revalidateCrag } = useContext(cragFormContext);

  useEffect(() => {
    setDate(new DateService(crag.opened_at || new Date()).date);
  }, [crag]);

  const { cragOpenedAtUpdateMutation } = useMutateCragOpenedAtUpdate({
    onSettled() {
      revalidateCrag();
    },
  });

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <DatePicker
        selected={date}
        onChange={(date) => {
          if (!date) {
            return;
          }

          const { dateStr } = new DateService(date);

          cragOpenedAtUpdateMutation.mutate({ cragId: crag.id, openedAt: dateStr });
        }}
        locale={ko}
        dateFormat="yyyy년 MM월 dd일"
        popperPlacement="bottom-start"
        scrollableMonthYearDropdown
        showMonthYearDropdown
        minDate={subYears(new Date(), 7)}
        maxDate={new Date()}
        customInput={<TextField label="개설일" />}
      />
      {crag.opened_at && (
        <IconButton
          onClick={() => {
            cragOpenedAtUpdateMutation.mutate({ cragId: crag.id, openedAt: null });
          }}
        >
          <DeleteIcon />
        </IconButton>
      )}
    </Box>
  );
}
