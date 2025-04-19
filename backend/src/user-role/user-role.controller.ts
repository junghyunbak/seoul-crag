import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { UserRoleService } from './user-role.service';

import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

@Roles('owner')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/users')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @Get(':id/roles')
  getRoles(@Param('id') userId: string) {
    return this.userRoleService.getRolesOfUser(userId);
  }

  @Post(':id/roles/:role')
  addRole(@Param('id') userId: string, @Param('role') roleId: string) {
    return this.userRoleService.addRoleToUser(userId, roleId);
  }

  @Delete(':id/roles/:role')
  removeRole(@Param('id') userId: string, @Param('role') roleId: string) {
    return this.userRoleService.removeRoleFromUser(userId, roleId);
  }
}
