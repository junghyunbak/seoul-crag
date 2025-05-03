import { Box, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { useFilter, useModifyFilter } from '@/hooks';

import { time } from '@/utils';

export function SelectExpeditionTime() {
  const { selectDate } = useFilter();

  const handleResetSelectDateButtonClick = () => {
    updateSelectDate(null);
  };

  const { updateSelectDate } = useModifyFilter();

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <TextField
        type="datetime-local"
        value={time.dateToDateTimeStr(selectDate || new Date())}
        slotProps={{
          htmlInput: {
            min: time.getCurrentDateTimeStr(),
            step: 1,
          },
        }}
        onChange={(e) => {
          updateSelectDate(time.dateTimeStrToDate(e.target.value));
        }}
      />
      {selectDate && (
        <IconButton onClick={handleResetSelectDateButtonClick}>
          <DeleteIcon />
        </IconButton>
      )}
    </Box>
  );
}
