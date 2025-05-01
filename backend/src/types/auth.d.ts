import { type Role } from 'src/role/role.entity';
import { type User } from 'src/user/user.entity';

type PassportUser = Omit<User, 'id' | 'created_at' | 'userRoles'>;
type JwtParsedUser = {
  id: string;
  username: string;
  provider: string;
  roles: Role[];
};
