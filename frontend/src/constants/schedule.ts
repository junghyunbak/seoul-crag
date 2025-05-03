export const SCHEDULE_TYPE_TO_COLORS: Record<ScheduleType, string> = {
  closed: '#ef5350',
  setup: '#42a5f5',
  reduced: '#ffa726',
};

export const SCHEDULE_TYPE_TO_LABELS: Record<ScheduleType, string> = {
  closed: '휴무일',
  setup: '세팅일',
  reduced: '단축운영',
};

export const SCHEDULE_TYPES: ScheduleType[] = ['closed', 'reduced', 'setup'];

export const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];
