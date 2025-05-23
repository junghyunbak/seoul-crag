import { Exclude, Expose } from 'class-transformer';

export class RoleResponseDto {
  @Exclude()
  id: string;

  @Expose()
  name: string;

  constructor(role: RoleResponseDto) {
    Object.assign(this, role);
  }
}
