import { Role } from 'src/role/role.entity';
import { type User } from 'src/user/user.entity';

declare global {
  type UserInfo = Omit<User, 'id' | 'created_at' | 'userRoles'> & {
    roles?: Role[];
  };

  namespace Express {
    interface User extends UserInfo {}
  }
}
