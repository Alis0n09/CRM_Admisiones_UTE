import { Body, Controller, Post, Get, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usuarioService: UsuarioService,
  ) {}

  @Post('login')
  @Public()
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  /**
   * Crea el primer administrador (solo si aún no existe ninguno).
   * No requiere estar logueado. Después de crearlo devuelve el token para ingresar.
   */
  @Post('bootstrap-admin')
  @Public()
  async bootstrapAdmin(@Body() body: { email: string; password: string }) {
    const email = body?.email?.trim();
    const password = body?.password;
    if (!email) throw new BadRequestException('El campo email es requerido');
    if (!password || String(password).length < 6) {
      throw new BadRequestException('El campo password es requerido y debe tener al menos 6 caracteres');
    }
    await this.usuarioService.createFirstAdmin(email, password);
    return this.authService.login(email, password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: any) {
    return {
      user: req.user,
      diagnostic: {
        hasRoles: !!(req.user?.roles && req.user.roles.length > 0),
        rolesCount: req.user?.roles?.length ?? 0,
        roles: req.user?.roles ?? [],
        hasIdCliente: !!req.user?.id_cliente,
        hasIdEmpleado: !!req.user?.id_empleado,
        message: req.user?.roles?.length === 0 
          ? '⚠️ PROBLEMA: El usuario NO tiene roles asignados. Debes asignar el rol ASESOR en la base de datos.'
          : '✅ Token válido con roles asignados'
      }
    };
  }
}
