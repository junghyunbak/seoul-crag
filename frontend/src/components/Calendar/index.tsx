import React from 'react';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/material';
import {
  parseISO,
  startOfWeek,
  endOfWeek,
  endOfMonth,
  differenceInCalendarWeeks,
  differenceInCalendarDays,
  getDay,
  addDays,
  max,
  min,
  addMilliseconds,
  format,
} from 'date-fns';
import { SCHEDULE_TYPE_TO_LABELS } from '@/constants';

const BAR_HEIGHT = 16;
const BAR_GAP = 2;
const DAYS_PER_WEEK = 7;
const MINUTES_IN_DAY = 1440;
const CELL_HEIGHT = 76;

interface Schedule {
  id: string;
  type: 'closed' | 'setup' | 'reduced';
  open_date: string;
  close_date: string;
  created_at: Date;
}

interface ScheduleChunk {
  id: string;
  type: 'closed' | 'setup' | 'reduced';
  from: string;
  to: string;
  weekIndex: number;
  dayStartIndex: number;
  span: number;
  showText: boolean;
  stackIndex?: number;
  leftRatio?: number;
  rightRatio?: number;
}

function getCalendarRange(monthStr: string) {
  const firstDay = parseISO(`${monthStr}-01`);
  const start = startOfWeek(firstDay, { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(firstDay), { weekStartsOn: 0 });
  return { start, end };
}

function isOverlapping(a: ScheduleChunk, b: ScheduleChunk): boolean {
  const startA = parseISO(a.from).getTime();
  const endA = parseISO(a.to).getTime();
  const startB = parseISO(b.from).getTime();
  const endB = parseISO(b.to).getTime();
  return startA < endB && startB < endA;
}

function preprocessSchedules(schedules: Schedule[], calendarStart: Date): ScheduleChunk[] {
  const chunks: ScheduleChunk[] = [];

  for (const s of schedules) {
    const open = parseISO(s.open_date);
    const close = parseISO(s.close_date);
    let cursor = open;
    let isFirstChunk = true;

    while (cursor <= close) {
      const weekStart = startOfWeek(cursor, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(cursor, { weekStartsOn: 0 });
      const chunkStart = max([weekStart, open]);
      const chunkEnd = min([weekEnd, close]);

      const weekIndex = differenceInCalendarWeeks(chunkStart, calendarStart, { weekStartsOn: 0 });
      const dayStartIndex = getDay(chunkStart);
      const span = differenceInCalendarDays(chunkEnd, chunkStart) + 1;

      const chunk: ScheduleChunk = {
        id: s.id,
        type: s.type,
        from: chunkStart.toISOString(),
        to: addMilliseconds(chunkEnd, 999).toISOString(),
        weekIndex,
        dayStartIndex,
        span,
        showText: isFirstChunk,
      };

      if (isFirstChunk) {
        const minutes = open.getHours() * 60 + open.getMinutes();
        chunk.leftRatio = minutes / MINUTES_IN_DAY;
      }

      const isLastChunk = differenceInCalendarDays(close, chunkEnd) === 0;
      if (isLastChunk) {
        const minutes = close.getHours() * 60 + close.getMinutes();
        chunk.rightRatio = minutes / MINUTES_IN_DAY;
      }

      chunks.push(chunk);
      cursor = addDays(weekEnd, 1);
      isFirstChunk = false;
    }
  }

  const layersByWeek = new Map<number, ScheduleChunk[][]>();
  for (const chunk of chunks) {
    const { weekIndex } = chunk;
    if (!layersByWeek.has(weekIndex)) layersByWeek.set(weekIndex, []);

    const layers = layersByWeek.get(weekIndex)!;
    let placed = false;

    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      if (layer.every((existing) => !isOverlapping(existing, chunk))) {
        layer.push(chunk);
        chunk.stackIndex = i;
        placed = true;
        break;
      }
    }

    if (!placed) {
      layers.push([chunk]);
      chunk.stackIndex = layers.length - 1;
    }
  }

  return chunks;
}

interface CalendarProps {
  schedules: Schedule[];
  targetMonth: string;
}

export const Calendar: React.FC<CalendarProps> = ({ schedules, targetMonth }) => {
  const weekdayLabels = ['일', '월', '화', '수', '목', '금', '토'];
  const { start: calendarStart, end: calendarEnd } = getCalendarRange(targetMonth);
  const chunks = preprocessSchedules(schedules, calendarStart);
  const totalDays = differenceInCalendarDays(calendarEnd, calendarStart) + 1;

  const stackMap = new Map<string, ScheduleChunk[]>();

  chunks.forEach((chunk) => {
    const key = `${chunk.weekIndex}-${chunk.dayStartIndex}`;
    if (!stackMap.has(key)) stackMap.set(key, []);
    stackMap.get(key)!.push(chunk);
  });

  const colorMap = {
    closed: '#d32f2f',
    setup: '#1976d2',
    reduced: '#f9a825',
  };

  return (
    <Box>
      <Grid container columns={DAYS_PER_WEEK}>
        {weekdayLabels.map((label, idx) => (
          <Grid
            size={{ xs: 1 }}
            key={`weekday-${idx}`}
            sx={{
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.875rem',
              fontWeight: 500,
              borderBottom: '1px solid #ccc',
              color: '#333',
            }}
          >
            {label}
          </Grid>
        ))}
      </Grid>

      <Grid container columns={DAYS_PER_WEEK} wrap="wrap">
        {Array.from({ length: totalDays }).map((_, i) => {
          const currentDate = addDays(calendarStart, i);
          const weekIndex = Math.floor(i / DAYS_PER_WEEK);
          const dayIndex = i % DAYS_PER_WEEK;
          const key = `${weekIndex}-${dayIndex}`;
          const barStack = stackMap.get(key) ?? [];

          return (
            <Grid
              size={{ xs: 1 }}
              key={i}
              sx={{
                height: `${CELL_HEIGHT}px`,
                position: 'relative',
                px: 1,
                borderRight: i % 7 === 6 ? 'none' : '1px solid #ddd',
                borderBottom: '1px solid #ddd',
              }}
            >
              <Box sx={{ position: 'absolute', top: 4, left: 4, fontSize: '0.75rem', color: '#555' }}>
                {i === 0 || addDays(calendarStart, i - 1).getMonth() !== currentDate.getMonth()
                  ? `${format(currentDate, 'M/d')}`
                  : format(currentDate, 'd')}
              </Box>

              {barStack.map((chunk) => {
                const fullMiddleCells = Math.max(0, chunk.span - 2);
                const leftPercent = (chunk.leftRatio ?? 0) * 100;
                const widthPercent =
                  chunk.span === 1
                    ? ((chunk.rightRatio ?? 1) - (chunk.leftRatio ?? 0)) * 100
                    : (1 - (chunk.leftRatio ?? 0)) * 100 + fullMiddleCells * 100 + (chunk.rightRatio ?? 1) * 100;

                return (
                  <Box
                    key={chunk.id}
                    sx={{
                      position: 'absolute',
                      zIndex: 1,
                      top: (chunk.stackIndex ?? 0) * (BAR_HEIGHT + BAR_GAP) + 20,
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                      height: BAR_HEIGHT,
                      backgroundColor: colorMap[chunk.type],
                      borderRadius: 0.5,
                      px: 1,
                      color: 'white',
                      fontSize: 12,
                      display: 'flex',
                      alignItems: 'center',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {chunk.showText ? SCHEDULE_TYPE_TO_LABELS[chunk.type] : ''}
                  </Box>
                );
              })}
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
