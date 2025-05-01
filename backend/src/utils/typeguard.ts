import * as ms from 'ms';
import { JwtParsedUser, PassportUser } from 'src/types/auth';

export function isStringMsStyle(str: string): str is ms.StringValue {
  return ms(str as ms.StringValue) !== undefined;
}

export function isJwtParsedUser(user: object): user is JwtParsedUser {
  return 'id' in user;
}

export function isPassportUser(user: object): user is PassportUser {
  return 'provider' in user;
}
