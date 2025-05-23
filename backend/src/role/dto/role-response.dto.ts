import { Exclude, Expose } from 'class-transformer';

export class RoleResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  constructor(role: RoleResponseDto) {
    Object.assign(this, role);
  }
}

export class RoleResponseWithoutIdDto {
  @Exclude()
  id: string;

  @Expose()
  name: string;

  constructor(role: RoleResponseWithoutIdDto) {
    Object.assign(this, role);
  }
}
