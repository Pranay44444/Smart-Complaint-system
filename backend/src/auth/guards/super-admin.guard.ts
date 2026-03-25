import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();

    if (!user || user.role !== Role.SUPER_ADMIN) {
      throw new ForbiddenException('Access restricted to Super Admins only');
    }

    return true;
  }
}
