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
    if (!normalizedEmail) throw new UnauthorizedException('Credenciales incorrectas');

    const usuario = await this.usuarioService.findByEmail(normalizedEmail);
    if (!usuario) throw new UnauthorizedException('Credenciales incorrectas');

    if (!usuario.activo) {
      throw new UnauthorizedException('Tu cuenta está desactivada');
    }

    const hash = usuario.password_hash;
    if (!hash || typeof hash !== 'string') {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    let ok = false;
    try {
      ok = await bcrypt.compare(password, hash);
    } catch {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    if (!ok) throw new UnauthorizedException('Credenciales incorrectas');

    const roles = usuario.rolUsuarios
      ?.filter((ru) => ru.rol && ru.rol.nombre)
      ?.map((ru) => ru.rol.nombre)
      ?? [];

    const payload = {
      sub: usuario.id_usuario,
      email: usuario.email,
      roles,
      id_cliente: usuario.id_cliente ?? null,
      id_empleado: usuario.id_empleado ?? null,
    };

    const access_token = this.jwtService.sign(payload);

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