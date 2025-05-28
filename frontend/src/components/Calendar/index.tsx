import React from 'react';

import Grid from '@mui/material/Grid';
import { Box, useTheme } from '@mui/material';

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

import holidayData from './holidays.ko.json';

import { DateService } from '@/utils/time';

import { useExp } from '@/hooks';

import { zIndex } from '@/styles';

const BAR_HEIGHT = 16;
const DAY_HEIGHT = 20;
const BAR_GAP = 2;
const DAYS_PER_WEEK = 7;
const MINUTES_IN_DAY = 1440;

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
  schedule: Schedule;
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
        schedule: s,
      };

      if (!s.is_all_day) {
        if (isFirstChunk) {
          const minutes = open.getHours() * 60 + open.getMinutes();
          chunk.leftRatio = minutes / MINUTES_IN_DAY;
        }

        const isLastChunk = differenceInCalendarDays(close, chunkEnd) === 0;

        if (isLastChunk) {
          const minutes = close.getHours() * 60 + close.getMinutes();
          chunk.rightRatio = minutes / MINUTES_IN_DAY;
        }
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

const weekdayLabels = Object.freeze(['일', '월', '화', '수', '목', '금', '토']);

const colorMap = {
  closed: '#d32f2f',
  setup: '#1976d2',
  reduced: '#f9a825',
};

interface CalendarProps {
  schedules: Schedule[];
  targetMonth: string;
  onScheduleClick: (schedule: Schedule) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ schedules, targetMonth, onScheduleClick }) => {
  const { start: calendarStart, end: calendarEnd } = getCalendarRange(targetMonth);
  const chunks = preprocessSchedules(schedules, calendarStart);
  const totalDays = differenceInCalendarDays(calendarEnd, calendarStart) + 1;

  const holiday2025 = holidayData[2025];

  const theme = useTheme();
  const { exp } = useExp();

  const stackMap = new Map<string, ScheduleChunk[]>();

  chunks.forEach((chunk) => {
    const key = `${chunk.weekIndex}-${chunk.dayStartIndex}`;
    if (!stackMap.has(key)) stackMap.set(key, []);
    stackMap.get(key)!.push(chunk);
  });

  const maxCellElementCount = Math.max(
    3,
    Math.max(
      ...Array.from(stackMap.values()).map((chunks) => Math.max(...chunks.map((chunk) => (chunk.stackIndex ?? 0) + 1)))
    )
  );

  const cellHeight = maxCellElementCount * BAR_HEIGHT + (maxCellElementCount + 1) * BAR_GAP + DAY_HEIGHT;

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
          const current = new DateService(addDays(calendarStart, i));

          const weekIndex = Math.floor(i / DAYS_PER_WEEK);
          const dayIndex = i % DAYS_PER_WEEK;
          const key = `${weekIndex}-${dayIndex}`;
          const barStack = stackMap.get(key) ?? [];

          const isHoliday = holiday2025.includes(current.dateStr);
          const isToday = exp.dateStr === current.dateStr;
          const isSunday = i % 7 === 0;

          const textColor = (() => {
            if (isToday) {
              return theme.palette.common.white;
            }

            if (isSunday || isHoliday) {
              return theme.palette.error.main;
            }

            return '#555';
          })();

          return (
            <Grid
              size={{ xs: 1 }}
              key={i}
              sx={{
                height: `${cellHeight}px`,
                position: 'relative',
                px: 1,
                borderRight: i % 7 === 6 ? 'none' : '1px solid #ddd',
                borderBottom: '1px solid #ddd',
              }}
            >
              <Box
                sx={(theme) => ({
                  position: 'absolute',
                  top: 4,
                  left: 4,
                  fontSize: '0.75rem',
                  color: textColor,
                  background: isToday ? theme.palette.primary.light : undefined,
                  borderRadius: 0.5,
                })}
              >
                {i === 0 || addDays(calendarStart, i - 1).getMonth() !== current.date.getMonth()
                  ? `${format(current.date, 'M/d')}`
                  : format(current.date, 'd')}
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
                      zIndex: zIndex.calendarChunk,
                      top: (chunk.stackIndex ?? 0) * (BAR_HEIGHT + BAR_GAP) + 20,
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                      height: BAR_HEIGHT,
                      backgroundColor: colorMap[chunk.type],
                      borderRadius: 0.5,
                      pl: 0.25,
                      color: 'white',
                      fontSize: 12,
                      display: 'flex',
                      alignItems: 'center',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    onClick={() => onScheduleClick(chunk.schedule)}
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
