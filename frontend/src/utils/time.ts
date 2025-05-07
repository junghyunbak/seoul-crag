import { format, parse, isValid } from 'date-fns';
import dayjs from 'dayjs';

export function convert24ToCustom12HourFormat(hour: number): string {
  if (hour < 0 || hour > 24) {
    throw new Error('시간은 0~24 사이여야 합니다.');
  }

  if (hour === 0) {
    return '전날 오후 12시';
  }

  if (hour === 12) {
    return '오전 12시';
  }

  if (hour === 24) {
    return '오후 12시';
  }

  const isAm = hour < 12;
  const period = isAm ? '오전' : '오후';
  const hour12 = hour % 12;

  return `${period} ${hour12}시`;
}

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
}

// TODO: HH:mm -> HH:mm:ss 로 바꿔야 하는 것 아닌가
export function minutesToTimeStr(mins: number): string {
  return dayjs().startOf('day').add(mins, 'minute').format('HH:mm');
}

export function engDayToKor(engDay: OpeningHourDayType) {
  switch (engDay) {
    case 'sunday':
      return '일요일';
    case 'monday':
      return '월요일';
    case 'tuesday':
      return '화요일';
    case 'wednesday':
      return '수요일';
    case 'thursday':
      return '목요일';
    case 'friday':
      return '금요일';
    case 'saturday':
      return '토요일';
    default:
      return '';
  }
}

export function normalizeToFullTimestamp(datetime: string): string {
  return datetime.length === 16
    ? `${datetime}:00` // ex: '2025-05-01T22:30' → '2025-05-01T22:30:00'
    : datetime;
}

export function getTodayMinutesFromDate(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

/**
 * [date]
 * yyyy-MM-dd
 *
 * [date - time(24)]
 * yyyy-MM-ddTHH:mm:ss
 *
 * [time(24)]
 * HH:mm:ss
 *
 * [js date object]
 * Date
 */
export const dateToDateStr = (date: Date) => format(date, 'yyyy-MM-dd');
export const dateToDateTimeStr = (date: Date) => format(date, "yyyy-MM-dd'T'HH:mm:ss");
export const dateToTimeStr = (date: Date) => format(date, 'HH:mm:ss');
export const dateToYearMonthStr = (date: Date) => format(date, 'yyyy-MM');

export const dateTimeStrToDate = (str: string) => parse(str, "yyyy-MM-dd'T'HH:mm:ss", new Date());
export const dateTimeStrToDateStr = (str: string) => dateToDateStr(dateTimeStrToDate(str));

export const timeStrToDate = (str: string, baseDate: Date = new Date()) => parse(str, 'HH:mm:ss', baseDate);

export class DateService {
  private _date: Date;

  constructor(date: Date | string | undefined | null) {
    if (date instanceof Date) {
      this._date = date;

      return;
    }

    if (typeof date === 'string') {
      const parseDate = new Date(date);

      this._date = isValid(parseDate) ? parseDate : new Date();

      return;
    }

    this._date = new Date();
  }

  get date() {
    return this._date;
  }

  get dateTimeStr() {
    return format(this._date, "yyyy-MM-dd'T'HH:mm:ss");
  }

  get dateStr() {
    return format(this._date, 'yyyy-MM-dd');
  }

  get timeStr() {
    return format(this._date, 'HH:mm:ss');
  }

  static dateTimeStrToDate(str: string) {
    return parse(str, "yyyy-MM-dd'T'HH:mm:ss", new Date());
  }

  static dateToDateTimeStr(date: Date) {
    return format(date, "yyyy-MM-dd'T'HH:mm:ss");
  }

  static timeToDate(str: string, baseDate: Date) {
    const parsedDate = parse(str, 'HH:mm:ss', baseDate);

    if (!isValid(parsedDate)) {
      return new Date();
    }

    return parsedDate;
  }

  static getCurrentDateTimeStr() {
    return format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
  }

  static timeStrToMinute(timeStr: string) {
    const [h, m] = timeStr.split(':').map(Number);

    return h * 60 + m;
  }
}
