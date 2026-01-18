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

    const roles = usuario.rolUsuarios?.map((ru) => ru.rol.nombre) ?? [];

    const payload = {
      sub: usuario.id_usuario,
      email: usuario.email,
      roles,
      id_cliente: (usuario as any).id_cliente ?? (usuario as any).cliente?.id_cliente ?? null,
    };

    return { access_token: this.jwtService.sign(payload) };
  }
}
