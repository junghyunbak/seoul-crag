import React, { useState } from 'react';

import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  TextField,
  Stack,
  Paper,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';

import { useFilter } from '@/hooks';

import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import holidayData from '../holidays.ko.json';

interface CalendarGridProps {
  currentMonth: Date;
  schedules: Schedule[];
  onCreate?: (schedule: Schedule) => void;
  onUpdate?: (schedule: Schedule) => void;
  onDelete?: (id: string) => void;
  readOnly?: boolean;
}

const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];

const scheduleType: Schedule['type'][] = ['closed', 'setup', 'lesson', 'remove', 'new', 'etc'];

const typeColors: Record<Schedule['type'], string> = {
  closed: '#ef5350',
  setup: '#42a5f5',
  lesson: '#66bb6a',
  etc: '#ab47bc',
  remove: '#ffa726',
  new: '#26c6da',
};

const typeLabels: Record<Schedule['type'], string> = {
  closed: '휴무일',
  setup: '세팅일',
  lesson: '강습일',
  etc: '기타',
  remove: '탈거일',
  new: '뉴세팅',
};

export function GymScheduleGrid({
  currentMonth,
  schedules,
  onCreate,
  onUpdate,
  onDelete,
  readOnly = false,
}: CalendarGridProps) {
  const [selected, setSelected] = useState<Schedule | null>(null);

  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });
  const emptyStart = getDay(start);
  const holidays: string[] = holidayData[2025];

  const { YYYYMMDDExpedition } = useFilter();

  const isHoliday = (iso: string, date: Date) => holidays.includes(iso) || getDay(date) === 0;
  const lastWeek = Math.ceil((emptyStart + days.length) / 7);

  const emptyEnd = lastWeek * 7 - emptyStart - days.length;

  const handleSave = () => {
    if (!selected) return;
    if (selected.id === '') onCreate?.(selected);
    else onUpdate?.(selected);
    setSelected(null);
  };

  return (
    <Paper>
      <Grid container columns={7}>
        {dayLabels.map((label, i) => (
          <Grid size={{ xs: 1 }} key={label} sx={{ borderRight: i === 6 ? 'none' : '1px solid #ccc' }}>
            <Typography align="center" fontWeight={600} sx={{ color: i === 0 ? 'error.main' : undefined }}>
              {label}
            </Typography>
          </Grid>
        ))}

        {Array.from({ length: emptyStart }).map((_, idx) => (
          <Grid
            size={{ xs: 1 }}
            key={`empty-${idx}`}
            sx={{
              height: { md: 124, xs: 100 },
              borderRight: '1px solid #ccc',
              borderBottom: '1px solid #ccc',
              p: 0.5,
              pl: 0,
              pb: 0,
            }}
          />
        ))}

        {days.map((day, i) => {
          const iso = format(day, 'yyyy-MM-dd');

          const holidaySchedule = holidays.includes(iso)
            ? [
                {
                  id: `holiday-${iso}`,
                  date: iso,
                  type: 'closed',
                  reason: '공휴일',
                  is_regular: false,
                  created_at: new Date(),
                } satisfies Schedule,
              ]
            : [];

          const combinedSchedules = [...holidaySchedule, ...schedules.filter((s) => s.date === iso)];
          const currentWeek = Math.ceil((emptyStart + i + 1) / 7);

          return (
            <Grid
              size={{ xs: 1 }}
              key={iso}
              sx={{
                borderRight: (i + emptyStart) % 7 === 6 ? 'none' : '1px solid #ccc',
                borderBottom: currentWeek === lastWeek ? 'none' : '1px solid #ccc',
                height: { md: 124, xs: 100 },
                position: 'relative',
                pt: 0.5,
                pr: 0.5,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography
                align="center"
                variant="body2"
                sx={{
                  background: iso === YYYYMMDDExpedition ? '#1976d2' : undefined,
                  borderRadius: iso === YYYYMMDDExpedition ? '50%' : undefined,
                  color: isHoliday(iso, day) ? 'error.main' : iso === YYYYMMDDExpedition ? 'white' : undefined,
                  width: 24,
                  height: 24,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                }}
              >
                {format(day, 'd')}
              </Typography>

              <Stack mt={0.5} sx={{ flex: 1, overflow: 'hidden' }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    overflowY: 'scroll',
                    gap: 0.5,
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                  }}
                >
                  {combinedSchedules
                    /**
                     * 정렬하지 않으면, 다른 일정 삭제로 인해 일정 순서가 변경되어 UX를 떨어뜨릴 수 있다.
                     */
                    .sort((a, b) => (a.created_at < b.created_at ? -1 : 1))
                    .map((s, i) => (
                      <Box
                        key={s.id}
                        sx={{
                          flexShrink: 0,
                          bgcolor: typeColors[s.type],
                          px: { md: 1, xs: 0.5 },
                          py: 0.2,
                          mb: combinedSchedules.length - 1 === i ? 0.5 : 0,
                          borderRadius: 0.5,
                          cursor: readOnly ? 'default' : 'pointer',
                        }}
                        onClick={() => !readOnly && !s.id.startsWith('holiday-') && setSelected(s)}
                      >
                        <Typography
                          sx={{
                            whiteSpace: 'normal',
                            wordBreak: 'break-all',
                            color: 'white',
                            fontSize: { md: 12, xs: 8 },
                          }}
                        >
                          {s.reason?.trim() ? s.reason : typeLabels[s.type]}
                        </Typography>
                      </Box>
                    ))}
                </Box>
              </Stack>

              {!readOnly && (
                <IconButton
                  size="small"
                  sx={{ position: 'absolute', right: 4, bottom: 4, bgcolor: 'white', boxShadow: 2 }}
                  onClick={() =>
                    setSelected({
                      id: '',
                      date: iso,
                      type: 'closed',
                      is_regular: false,
                      created_at: new Date(),
                    })
                  }
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              )}
            </Grid>
          );
        })}

        {Array.from({ length: emptyEnd }).map((_, idx) => (
          <Grid
            size={{ xs: 1 }}
            key={`empty-${idx}`}
            style={{
              borderRight: emptyEnd - 1 === idx ? 'none' : '1px solid #ccc',
            }}
            sx={{
              height: { md: 124, xs: 100 },
              p: 0.5,
              pl: 0,
              pb: 0,
            }}
          />
        ))}
      </Grid>

      {!readOnly && selected && (
        <Dialog open onClose={() => setSelected(null)}>
          <DialogTitle>{selected.id ? '일정 편집' : '일정 추가'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={1}>
              <Typography>날짜: {selected.date}</Typography>
              <Select
                fullWidth
                value={selected.type || 'closed'}
                onChange={(e) =>
                  setSelected((prev) => (prev ? { ...prev, type: e.target.value as Schedule['type'] } : prev))
                }
              >
                {scheduleType.map((type) => (
                  <MenuItem value={type}>{typeLabels[type]}</MenuItem>
                ))}
              </Select>
              <TextField
                label="사유"
                value={selected.reason ?? ''}
                onChange={(e) => setSelected((prev) => (prev ? { ...prev, reason: e.target.value } : prev))}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelected(null)}>취소</Button>
            {selected.id && (
              <Button
                color="error"
                onClick={() => {
                  onDelete?.(selected.id);
                  setSelected(null);
                }}
              >
                삭제
              </Button>
            )}
            <Button variant="contained" onClick={handleSave}>
              {selected.id ? '수정' : '추가'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Paper>
  );
}

interface ScheduleTypesProps {
  color?: React.CSSProperties['color'];
}

export function ScheduleTypes({ color = 'black' }: ScheduleTypesProps) {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'start',
        gap: 1.5,
        p: 1,
      }}
    >
      {scheduleType.map((type) => {
        return (
          <Box
            key={type}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Box
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: typeColors[type],
              }}
            />

            <Typography
              style={{
                color,
              }}
            >
              {typeLabels[type]}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
