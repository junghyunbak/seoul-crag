import { Exclude, Expose, Type } from 'class-transformer';
import { UserRoleResponseDto } from 'src/user-role/dto/user-role-response.dto';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Exclude()
  refresh_token_hash: string;

  @Exclude()
  provider_id: string;

  @Exclude()
  provider: string;

  @Expose()
  @Type(() => UserRoleResponseDto)
  userRoles: UserRoleResponseDto[];

  constructor(user: Partial<UserResponseDto>) {
    Object.assign(this, user);
  }
}
