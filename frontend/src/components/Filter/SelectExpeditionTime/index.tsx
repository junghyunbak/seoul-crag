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
          },
        }}
        onChange={(e) => {
          if (!e.target.value) {
            updateSelectDate(null);
            return;
          }

          updateSelectDate(time.dateTimeStrToDate(time.normalizeToFullTimestamp(e.target.value)));
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
