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

export const DAY_STR_TO_INDEX: Record<OpeningHourDayType, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export const DAY_STR_TO_KOR: Record<OpeningHourDayType, string> = {
  sunday: '일요일',
  monday: '월요일',
  tuesday: '화요일',
  wednesday: '수요일',
  thursday: '목요일',
  friday: '금요일',
  saturday: '토요일',
};

export const DAYS_OF_KOR = Object.values(DAY_STR_TO_KOR);
