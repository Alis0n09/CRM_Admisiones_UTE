import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Public } from './public.decorator';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
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

  @Post('forgot-password')
  @Public()
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @Public()
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return await this.authService.resetPassword(dto.token, dto.password);
  }
}
