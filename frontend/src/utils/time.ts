import { format, parse } from 'date-fns';
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

export function minutesToTimeStr(mins: number): string {
  return dayjs().startOf('day').add(mins, 'minute').format('HH:mm');
}

export function timeStrToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
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
export const getCurrentDateTimeStr = () => format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");

export const dateToDateStr = (date: Date) => format(date, 'yyyy-MM-dd');

export const dateToDateTimeStr = (date: Date) => format(date, "yyyy-MM-dd'T'HH:mm:ss");

export const dateTimeStrToDate = (str: string) => parse(str, "yyyy-MM-dd'T'HH:mm:ss", new Date());

export const dateTimeStrToDateStr = (str: string) => dateToDateStr(dateTimeStrToDate(str));

export const timeStrToDate = (str: string, baseDate: Date = new Date()) => parse(str, 'HH:mm:ss', baseDate);
