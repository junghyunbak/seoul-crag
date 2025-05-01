import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { RoleName } from 'src/role/role.entity';
import { isJwtParsedUser } from 'src/utils/typeguard';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleName[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Express.Request>();
    const user = request.user;

    if (!user || !isJwtParsedUser(user)) {
      throw new ForbiddenException('권한 정보가 없습니다');
    }

    const isOwner = user.roles.some((role) => role.name === 'owner');

    if (isOwner) {
      return true;
    }

    const hasRole = user.roles.some((role) =>
      requiredRoles.includes(role.name),
    );

    if (!hasRole) {
      throw new ForbiddenException('접근 권한이 없습니다');
    }

    return true;
  }
}
