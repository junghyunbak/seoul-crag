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

export const DAYS_OF_KOR = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
