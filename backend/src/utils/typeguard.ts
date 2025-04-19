import * as ms from 'ms';

export function isStringMsStyle(str: string): str is ms.StringValue {
  return ms(str as ms.StringValue) !== undefined;
}
