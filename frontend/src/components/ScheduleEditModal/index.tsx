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

import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { isBefore, isEqual } from 'date-fns';

interface ScheduleEditModalProps {
  /**
   * object : 일정 변경
   * null : 일정 추가
   * undefined: 모달 close
   */
  schedule: Schedule | null | undefined;
  initOpenDate?: Date;
  initCloseDate?: Date;
  onClick: () => void;
  onClose: () => void;
  onDelete: (scheduleId: string) => void;
  onCreate?: (openDate: string, closeDate: string, type: ScheduleType) => void;
  onUpdate?: (scheduleId: string, openDate: string, closeDate: string, type: ScheduleType) => void;
}

export function ScheduleEditModal({
  schedule,
  initOpenDate = new Date(),
  initCloseDate = new Date(),
  onClick,
  onClose,
  onDelete,
  onCreate = () => {},
  onUpdate = () => {},
}: ScheduleEditModalProps) {
  const [scheduleType, setScheduleType] = useState<ScheduleType>('closed');
  const [openDate, setOpenDate] = useState(initOpenDate);
  const [closeDate, setCloseDate] = useState(initCloseDate);

  useEffect(() => {
    if (schedule?.type) {
      setScheduleType(schedule.type);
    }

    if (schedule?.open_date) {
      setOpenDate(time.dateTimeStrToDate(schedule.open_date));
    }

    if (schedule?.close_date) {
      setCloseDate(time.dateTimeStrToDate(schedule.close_date));
    }
  }, [schedule]);

  return (
    <>
      <Button variant="contained" onClick={onClick}>
        일정 추가
      </Button>

      <Dialog
        open={schedule !== undefined}
        onClose={onClose}
        slotProps={{
          paper: {
            sx: {
              overflow: 'visible',
            },
          },
        }}
      >
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
              <DatePicker
                selected={openDate}
                onChange={(date) => setOpenDate(date || new Date())}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={30}
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

              <DatePicker
                selected={closeDate}
                onChange={(date) => setCloseDate(date || new Date())}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={30}
                locale={ko}
                dateFormat="yyyy.MM.dd  h:mm a"
                popperPlacement="bottom-end"
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
                if (!(isBefore(openDate, closeDate) || isEqual(openDate, closeDate))) {
                  alert('마감 시간이 오픈 시간보다 먼저일 수 없습니다.');
                  return;
                }

                onUpdate(
                  schedule.id,
                  time.dateToDateTimeStr(openDate),
                  time.dateToDateTimeStr(closeDate),
                  scheduleType
                );
                onClose();
              }}
            >
              수정
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => {
                if (!(isBefore(openDate, closeDate) || isEqual(openDate, closeDate))) {
                  alert('마감 시간이 오픈 시간보다 먼저일 수 없습니다.');
                  return;
                }

                onCreate(time.dateToDateTimeStr(openDate), time.dateToDateTimeStr(closeDate), scheduleType);
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
