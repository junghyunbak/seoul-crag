import { useEffect, useState } from 'react';

import {
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';

import { SCHEDULE_TYPES, SCHEDULE_TYPE_TO_LABELS } from '@/constants';

import { time } from '@/utils';

interface ScheduleEditModalProps {
  /**
   * object : 일정 변경
   * null : 일정 추가
   * undefined: 모달 close
   */
  schedule: Schedule | null | undefined;
  onClick: () => void;
  onClose: () => void;
  onDelete: (scheduleId: string) => void;
  onCreate?: (openDate: string, closeDate: string, type: ScheduleType) => void;
  onUpdate?: (scheduleId: string, openDate: string, closeDate: string, type: ScheduleType) => void;
}

export function ScheduleEditModal({
  schedule,
  onClick,
  onClose,
  onDelete,
  onCreate = () => {},
  onUpdate = () => {},
}: ScheduleEditModalProps) {
  const [scheduleType, setScheduleType] = useState<ScheduleType>('closed');
  const [openDate, setOpenDate] = useState(time.getCurrentDateTimeStr());
  const [closeDate, setCloseDate] = useState(time.getCurrentDateTimeStr());

  useEffect(() => {
    if (schedule?.type) {
      setScheduleType(schedule.type);
    }

    if (schedule?.open_date) {
      setOpenDate(schedule.open_date);
    }

    if (schedule?.close_date) {
      setCloseDate(schedule.close_date);
    }
  }, [schedule]);

  return (
    <>
      <Button variant="contained" onClick={onClick}>
        일정 추가
      </Button>

      <Dialog open={schedule !== undefined} onClose={onClose}>
        <DialogTitle>{schedule ? '일정 편집' : '일정 추가'}</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Select
              fullWidth
              value={scheduleType}
              onChange={(e) => {
                setScheduleType(e.target.value as ScheduleType);
              }}
            >
              {SCHEDULE_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {SCHEDULE_TYPE_TO_LABELS[type]}
                </MenuItem>
              ))}
            </Select>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                type="datetime-local"
                value={openDate}
                slotProps={{
                  htmlInput: {
                    max: closeDate,
                    step: 1,
                  },
                }}
                onChange={(e) => {
                  setOpenDate(e.target.value);
                }}
              />
              <TextField
                type="datetime-local"
                value={closeDate}
                slotProps={{
                  htmlInput: {
                    min: openDate,
                    step: 1,
                  },
                }}
                onChange={(e) => {
                  setCloseDate(e.target.value);
                }}
              />
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>취소</Button>

          {schedule && (
            <Button
              color="error"
              onClick={() => {
                onDelete(schedule.id);
                onClose();
              }}
            >
              삭제
            </Button>
          )}

          {schedule ? (
            <Button
              variant="contained"
              onClick={() => {
                onUpdate(schedule.id, openDate, closeDate, scheduleType);
                onClose();
              }}
            >
              수정
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => {
                onCreate(openDate, closeDate, scheduleType);
                onClose();
              }}
            >
              추가
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
