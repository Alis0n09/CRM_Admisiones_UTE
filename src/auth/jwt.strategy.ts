import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    if (!payload) throw new UnauthorizedException('Token inválido');

    // ✅ Soporta: payload.roles (array) | payload.roles (string) | payload.role (string)
    const rawRoles =
      payload.roles ?? payload.role ?? payload.rol ?? [];

    const roles = Array.isArray(rawRoles)
      ? rawRoles
      : [rawRoles];

    // ✅ normaliza: "asesor" -> "ASESOR"
    const normalizedRoles = roles
      .filter(Boolean)
      .map((r: any) => String(r).toUpperCase());

    return {
      id_usuario: payload.sub,
      email: payload.email,
      roles: normalizedRoles, // ✅ siempre array y normalizado
      id_cliente: payload.id_cliente ?? null,
      id_empleado: payload.id_empleado ?? null, 
    };
  }
} 