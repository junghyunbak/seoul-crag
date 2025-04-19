import { type Role } from 'src/role/role.entity';

declare global {
  type JwtPayload = {
    id: string;
    username: string;
    provider: string;
    roles: Role[];
  };
}
