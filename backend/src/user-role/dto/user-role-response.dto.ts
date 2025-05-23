import { Expose, Type } from 'class-transformer';
import { RoleResponseWithoutIdDto } from 'src/role/dto/role-response.dto';

export class UserRoleResponseDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => RoleResponseWithoutIdDto)
  role: RoleResponseWithoutIdDto;

  constructor(userRole: Partial<UserRoleResponseDto>) {
    Object.assign(this, userRole);
  }
}
