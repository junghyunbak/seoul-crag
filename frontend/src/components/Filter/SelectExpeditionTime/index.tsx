import { Box, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import DatePicker from 'react-datepicker';

import { useFilter, useModifyFilter } from '@/hooks';

import { ko } from 'date-fns/locale';

import 'react-datepicker/dist/react-datepicker.css';

export function SelectExpeditionTime() {
  const { expeditionDate, selectDate } = useFilter();

  const handleResetSelectDateButtonClick = () => {
    updateSelectDate(null);
  };

  const { updateSelectDate } = useModifyFilter();

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <DatePicker
        selected={expeditionDate}
        onChange={updateSelectDate}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        timeCaption="time"
        locale={ko}
        dateFormat="yyyy.MM.dd  h:mm a"
        popperPlacement="bottom-start"
        customInput={
          <TextField
            variant="outlined"
            size="small"
            slotProps={{
              htmlInput: {
                readOnly: true,
              },
            }}
          />
        }
      />

      {selectDate && (
        <IconButton onClick={handleResetSelectDateButtonClick}>
          <DeleteIcon />
        </IconButton>
      )}
    </Box>
  );
}
