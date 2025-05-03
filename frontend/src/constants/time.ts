export const DEFAULT_START_TIME = 0;
export const DEFAULT_END_TIME = 24;

export const DAYS_OF_WEEK: OpeningHourDayType[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

export const DAY_TO_INDEX: Record<OpeningHourDayType, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export const DAYS_OF_KOR = ['일', '월', '화', '수', '목', '금', '토'];
