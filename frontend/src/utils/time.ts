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
