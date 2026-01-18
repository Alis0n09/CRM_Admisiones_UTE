import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new ForbiddenException('No autenticado');

    // 🔽 🔽 🔽 LO QUE FALTABA (SIN ROMPER LO EXISTENTE)
    const userRoles: string[] = Array.isArray(user.roles)
      ? user.roles
      : user.role
      ? [user.role]
      : [];
    // 🔼 🔼 🔼

    const ok = requiredRoles.some((role) => userRoles.includes(role));

    if (!ok) throw new ForbiddenException('No tienes permisos');

    return true;
  }
}
