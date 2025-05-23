import { Expose, Type } from 'class-transformer';
import { RoleResponseDto } from 'src/role/dto/role-response.dto';

export class UserRoleResponseDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => RoleResponseDto)
  role: RoleResponseDto;

  constructor(userRole: Partial<UserRoleResponseDto>) {
    Object.assign(this, userRole);
  }
}
