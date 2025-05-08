import { Box } from '@mui/material';
import { DateService } from '@/utils/time';
import { ScheduleElementRecord } from './ScheduleElementRecord';

interface ScheduleElementProps {
  schedules: Schedule[];
  current: DateService;
  onScheduleElementClick: (schedule: Schedule) => void;
  readOnly?: boolean;
}

export function ScheduleElement({
  schedules,
  current,
  onScheduleElementClick,
  readOnly = false,
}: ScheduleElementProps) {
  return (
    <Box sx={{ mt: 0.5, width: '100%', height: '100%', overflow: 'hidden' }}>
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
        {schedules.map((schedule) => {
          const { open_date, close_date, type, id } = schedule;

          const sopen = new DateService(open_date);
          const sclose = new DateService(close_date);

          const isFirst = sopen.dateStr === current.dateStr;
          const isLast = sclose.dateStr === current.dateStr;

          let leftPer = 0;
          let rightPer = 0;

          switch (type) {
            case 'closed': {
              break;
            }
            case 'reduced':
            case 'setup': {
              if (isFirst && isLast) {
                leftPer = 0;
                rightPer = 0;
              } else if (isFirst) {
                leftPer = (sopen.minute / 1440) * 100;
                rightPer = 0;
              } else if (isLast) {
                leftPer = 0;
                rightPer = ((1440 - sclose.minute) / 1440) * 100;
              }

              break;
            }
          }

          return (
            <ScheduleElementRecord
              key={id}
              leftPer={leftPer}
              rightPer={rightPer}
              schedule={schedule}
              isFirst={isFirst}
              isLast={isLast}
              onClick={() => onScheduleElementClick(schedule)}
              readonly={readOnly}
            />
          );
        })}
      </Box>
    </Box>
  );
}
