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
    const usuario = await this.usuarioService.findByEmail(email);
    if (!usuario) throw new UnauthorizedException('Credenciales incorrectas');

    const ok = await bcrypt.compare(password, usuario.password_hash);
    if (!ok) throw new UnauthorizedException('Credenciales incorrectas');

    console.log('Usuario encontrado:', {
      email: usuario.email,
      id_usuario: usuario.id_usuario,
      rolUsuarios_length: usuario.rolUsuarios?.length ?? 0,
      rolUsuarios: usuario.rolUsuarios?.map(ru => ({
        id: ru.id,
        rol: ru.rol ? { id: ru.rol.id_rol, nombre: ru.rol.nombre } : null
      })) ?? []
    });

    const roles = usuario.rolUsuarios
      ?.filter((ru) => ru.rol && ru.rol.nombre)
      ?.map((ru) => ru.rol.nombre)
      ?? [];

    console.log('Roles extraídos:', roles);

    const payload = {
      sub: usuario.id_usuario,
      email: usuario.email,
      roles,
      id_cliente: usuario.id_cliente ?? null,
      id_empleado: usuario.id_empleado ?? null,
    };

    console.log('Payload JWT:', payload);

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