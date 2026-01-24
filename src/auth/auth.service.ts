import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const normalizedEmail = (email ?? '').trim().toLowerCase();

    console.log('🔍 Intentando login con email:', normalizedEmail);

    const usuario = await this.usuarioService.findByEmail(normalizedEmail);
    
    if (!usuario) {
      console.log('❌ Usuario no encontrado con email:', normalizedEmail);
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    console.log('✅ Usuario encontrado:', {
      id_usuario: usuario.id_usuario,
      email: usuario.email,
      activo: usuario.activo,
      tienePassword: !!usuario.password_hash
    });

    if (!usuario.activo) {
      console.log('❌ Usuario inactivo');
      throw new UnauthorizedException('Tu cuenta está desactivada');
    }

    const ok = await bcrypt.compare(password, usuario.password_hash);
    if (!ok) {
      console.log('❌ Contraseña incorrecta');
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // ✅ roles desde relación (rolUsuarios -> rol -> nombre)
    const rolesRaw = usuario.rolUsuarios?.map((ru) => ru?.rol?.nombre).filter(Boolean) as string[] | undefined;
    const roles = Array.from(new Set(rolesRaw ?? [])); // sin duplicados

    // (opcional) si quieres bloquear login si no tiene roles:
    // if (roles.length === 0) {
    //   throw new UnauthorizedException('Tu cuenta no tiene un rol asignado');
    // }

    const payload = {
      sub: usuario.id_usuario,
      email: usuario.email,
      roles,
      id_cliente: usuario.id_cliente ?? null,
      id_empleado: usuario.id_empleado ?? null,
    };

    const access_token = this.jwtService.sign(payload);

    // ✅ ahora el frontend recibe res.user y ya no queda roles=[]
    return {
      access_token,
      user: {
        id_usuario: usuario.id_usuario,
        email: usuario.email,
        roles,
        id_cliente: usuario.id_cliente ?? null,
        id_empleado: usuario.id_empleado ?? null,
      },
    };
  }
}