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
    const requiredRoles =
      this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new ForbiddenException('No autenticado');

    const rawUserRoles = user.roles ?? user.role ?? user.rol ?? [];
    const userRoles = (Array.isArray(rawUserRoles) ? rawUserRoles : [rawUserRoles])
      .filter(Boolean)
      .map((r: any) => String(r).toUpperCase());

    const required = requiredRoles.map((r) => String(r).toUpperCase());

    const ok = required.some((role) => userRoles.includes(role));
    
    if (!ok) {
      console.log('🚫 RolesGuard - Acceso denegado:', {
        requiredRoles,
        userRoles,
        userEmail: user.email,
        hasRoles: userRoles.length > 0,
        message: userRoles.length === 0 
          ? 'El usuario NO tiene roles asignados en el token. Verifica que el usuario tenga roles en la BD y haz login nuevamente.'
          : `El usuario tiene roles [${userRoles.join(', ')}] pero necesita uno de: [${required.join(', ')}]`
      });
      throw new ForbiddenException('No tienes permisos');
    }

    return true;
  }
}
