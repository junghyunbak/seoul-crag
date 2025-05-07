import { format, parse, isValid } from 'date-fns';
import dayjs from 'dayjs';

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

export class DateService {
  private _date: Date;

  constructor(date: Date | string | undefined) {
    if (date instanceof Date) {
      this._date = date;

      return;
    }

    if (typeof date === 'string') {
      const parseDate = new Date(date);

      this._date = isValid(parseDate) ? parseDate : new Date(0);

      return;
    }

    this._date = new Date(0);
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

  get minute() {
    return this._date.getHours() * 60 + this._date.getMinutes();
  }

  static dateTimeStrToDate(str: string) {
    return parse(str, "yyyy-MM-dd'T'HH:mm:ss", new Date());
  }

  static dateToDateTimeStr(date: Date) {
    return format(date, "yyyy-MM-dd'T'HH:mm:ss");
  }

  static getCurrentDateTimeStr() {
    return format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
  }

  static timeStrToDate(timeStr: string, baseDate: Date) {
    const parsedDate = parse(timeStr, 'HH:mm:ss', baseDate);

    if (!isValid(parsedDate)) {
      return new Date(0);
    }

    return parsedDate;
  }

  static timeStrToMinute(timeStr: string) {
    const [h, m] = timeStr.split(':').map(Number);

    return h * 60 + m;
  }
}
