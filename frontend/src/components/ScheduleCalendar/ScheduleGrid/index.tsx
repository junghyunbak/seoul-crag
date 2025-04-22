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
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/GridLegacy';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { useState } from 'react';
import holidayData from '../holidays.ko.json' assert { type: 'json' };

interface CalendarGridProps {
  currentMonth: Date;
  schedules: Schedule[];
  onCreate?: (schedule: Schedule) => void;
  onUpdate?: (schedule: Schedule) => void;
  onDelete?: (id: string) => void;
  readOnly?: boolean;
}

const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];

const typeColors: Record<Schedule['type'], string> = {
  closed: '#ef5350',
  setup: '#42a5f5',
  lesson: '#66bb6a',
  etc: '#ab47bc',
};

const typeLabels: Record<Schedule['type'], string> = {
  closed: '휴무일',
  setup: '세팅일',
  lesson: '강습일',
  etc: '기타',
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
  const todayIso = format(new Date(), 'yyyy-MM-dd');

  const isHoliday = (iso: string, date: Date) => holidays.includes(iso) || getDay(date) === 0;
  const lastWeek = Math.ceil((emptyStart + days.length) / 7);

  const handleSave = () => {
    if (!selected) return;
    if (selected.id === '') onCreate?.(selected);
    else onUpdate?.(selected);
    setSelected(null);
  };

  return (
    <Paper>
      <Grid container columns={7} spacing={0.5}>
        {dayLabels.map((label, i) => (
          <Grid item xs={1} key={label} sx={{ borderRight: i === 6 ? 'none' : '1px solid #ccc' }}>
            <Typography align="center" fontWeight={600} sx={{ color: i === 0 ? 'error.main' : undefined }}>
              {label}
            </Typography>
          </Grid>
        ))}

        {Array.from({ length: emptyStart }).map((_, idx) => (
          <Grid
            item
            xs={1}
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
              item
              xs={1}
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
                  background: iso === todayIso ? '#1976d2' : undefined,
                  borderRadius: iso === todayIso ? '50%' : undefined,
                  color: isHoliday(iso, day) ? 'error.main' : iso === todayIso ? 'white' : undefined,
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
                  {combinedSchedules.map((s, i) => (
                    <Box
                      key={s.id}
                      sx={{
                        bgcolor: typeColors[s.type],
                        color: 'white',
                        flexShrink: 0,
                        px: { md: 1, xs: 0.5 },
                        py: 0.2,
                        mb: combinedSchedules.length - 1 === i ? 0.5 : 0,
                        borderRadius: 0.5,
                        fontSize: { md: 12, xs: 8 },
                        cursor: readOnly ? 'default' : 'pointer',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      onClick={() => !readOnly && !s.id.startsWith('holiday-') && setSelected(s)}
                    >
                      {s.reason?.trim() ? s.reason : typeLabels[s.type]}
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
                <MenuItem value="closed">휴무일</MenuItem>
                <MenuItem value="setup">세팅일</MenuItem>
                <MenuItem value="lesson">강습일</MenuItem>
                <MenuItem value="etc">기타</MenuItem>
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
