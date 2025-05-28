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
  FormControlLabel,
  Checkbox,
} from '@mui/material';

import { SCHEDULE_TYPES, SCHEDULE_TYPE_TO_LABELS } from '@/constants';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { isBefore, isEqual } from 'date-fns';
import { ko } from 'date-fns/locale';

import { DateService } from '@/utils/time';

import './index.css';

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
  onCreate?: (schedule: MyOmit<Schedule, 'id' | 'created_at'>) => void;
  onUpdate?: (Schedule: MyOmit<Schedule, 'created_at'>) => void;
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
  const [isAllDay, setIsAllDay] = useState(false);

  useEffect(() => {
    if (!schedule) {
      return;
    }

    const { type, open_date, close_date, is_all_day } = schedule;

    const open = new DateService(open_date);
    const close = new DateService(close_date);

    setScheduleType(type);
    setOpenDate(open.date);
    setCloseDate(close.date);
    setIsAllDay(is_all_day);
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
              maxWidth: 'none',
            },
          },
        }}
      >
        <DialogTitle>{schedule ? '일정 편집' : '일정 추가'}</DialogTitle>

        <DialogContent>
          <Stack
            spacing={2}
            mt={1}
            className="schedule-edit-modal"
            sx={{
              alignItems: 'flex-start',
            }}
          >
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

            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flexDirection: {
                  xs: 'column',
                  md: 'row',
                },
              }}
            >
              <DatePicker
                selected={openDate}
                onChange={(date) => {
                  if (isAllDay) {
                    setCloseDate(date || new Date());
                  }

                  setOpenDate(date || new Date());
                }}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={30}
                locale={ko}
                open
                dateFormat="yyyy.MM.dd  h:mm a"
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

              <Box
                sx={{
                  filter: isAllDay ? 'brightness(0.7)' : undefined,
                  pointerEvents: isAllDay ? 'none' : undefined,
                }}
              >
                <DatePicker
                  selected={isAllDay ? openDate : closeDate}
                  onChange={(date) => setCloseDate(date || new Date())}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={30}
                  locale={ko}
                  dateFormat="yyyy.MM.dd  h:mm a"
                  open
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
            </Box>

            <FormControlLabel
              label="하루 종일"
              control={<Checkbox checked={isAllDay} onChange={(e) => setIsAllDay(e.target.checked)} />}
            />
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

                onUpdate({
                  id: schedule.id,
                  open_date: DateService.dateToDateTimeStr(openDate),
                  close_date: DateService.dateToDateTimeStr(closeDate),
                  type: scheduleType,
                  is_all_day: isAllDay,
                });
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

                onCreate({
                  open_date: DateService.dateToDateTimeStr(openDate),
                  close_date: DateService.dateToDateTimeStr(closeDate),
                  type: scheduleType,
                  is_all_day: isAllDay,
                });
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
