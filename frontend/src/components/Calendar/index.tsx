import React from 'react';
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

const BAR_HEIGHT = 20;
const BAR_GAP = 4;
const DAYS_PER_WEEK = 7;
const MINUTES_IN_DAY = 1440;

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
  const { start: calendarStart, end: calendarEnd } = getCalendarRange(targetMonth);
  const chunks = preprocessSchedules(schedules, calendarStart);
  const totalWeeks = differenceInCalendarWeeks(calendarEnd, calendarStart, { weekStartsOn: 0 }) + 1;

  const stackMap = new Map<string, ScheduleChunk[]>();
  const maxStackByWeek: number[] = Array(totalWeeks).fill(1);

  chunks.forEach((chunk) => {
    const key = `${chunk.weekIndex}-${chunk.dayStartIndex}`;
    if (!stackMap.has(key)) stackMap.set(key, []);
    stackMap.get(key)!.push(chunk);
    if ((chunk.stackIndex ?? 0) + 1 > maxStackByWeek[chunk.weekIndex]) {
      maxStackByWeek[chunk.weekIndex] = (chunk.stackIndex ?? 0) + 1;
    }
  });

  const rowHeights = maxStackByWeek.map((n) => `${n * (BAR_HEIGHT + BAR_GAP)}px`).join(' ');

  const colorMap = {
    closed: '#d32f2f',
    setup: '#1976d2',
    reduced: '#f9a825',
  };

  return (
    <Box
      display="grid"
      gridTemplateColumns={`repeat(${DAYS_PER_WEEK}, 1fr)`}
      gridTemplateRows={rowHeights}
      position="relative"
    >
      {Array.from({ length: totalWeeks * DAYS_PER_WEEK }).map((_, i) => {
        const weekIndex = Math.floor(i / DAYS_PER_WEEK);
        const dayIndex = i % DAYS_PER_WEEK;
        const key = `${weekIndex}-${dayIndex}`;
        const barStack = stackMap.get(key) ?? [];

        return (
          <Box
            key={i}
            sx={{
              border: '1px solid #ddd',
              position: 'relative',
              overflow: 'visible',
              padding: 1,
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                zIndex: 1,
                top: 4,
                left: 4,
                fontSize: '0.75rem',
                color: '#555',
              }}
            >
              {format(addDays(calendarStart, i), 'd')}
            </Box>

            {barStack.length === 0 && <Box sx={{ height: BAR_HEIGHT }} />}
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
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`,
                    top: (chunk.stackIndex ?? 0) * (BAR_HEIGHT + BAR_GAP),
                    height: BAR_HEIGHT,
                    backgroundColor: colorMap[chunk.type],
                    borderRadius: 1,
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
                  {chunk.showText ? chunk.type : ''}
                </Box>
              );
            })}
          </Box>
        );
      })}
    </Box>
  );
};
