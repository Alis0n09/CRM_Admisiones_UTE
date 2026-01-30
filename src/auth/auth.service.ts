import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { UsuarioService } from '../usuario/usuario.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async login(email: string, password: string) {
    const normalizedEmail = (email ?? '').trim().toLowerCase();
    
    const usuario = await this.usuarioService.findByEmail(normalizedEmail);
    if (!usuario) throw new UnauthorizedException('Credenciales incorrectas');

    if (!usuario.activo) {
      throw new UnauthorizedException('Tu cuenta está desactivada');
    }

    const ok = await bcrypt.compare(password, usuario.password_hash);
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

  async forgotPassword(email: string) {
    const normalizedEmail = (email ?? '').trim().toLowerCase();
    const usuario = await this.usuarioService.findByEmail(normalizedEmail);
    
    // Por seguridad, no revelamos si el email existe o no
    if (!usuario) {
      return { message: 'Si el email existe, se enviará un enlace de recuperación' };
    }

    // Generar token único
    const resetToken = randomBytes(32).toString('hex');
    const fechaExpiracion = new Date();
    fechaExpiracion.setHours(fechaExpiracion.getHours() + 1); // Expira en 1 hora

    // Guardar token en la base de datos
    await this.usuarioService.updateResetToken(normalizedEmail, resetToken, fechaExpiracion);

    // URL del frontend (Vite suele usar 5173; Angular 4200). Definir FRONTEND_URL en .env.
    const baseUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    // Enviar email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Recuperación de Contraseña</h2>
        <p>Hola,</p>
        <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
        <p style="margin: 20px 0;">
          <a href="${resetUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Restablecer Contraseña
          </a>
        </p>
        <p>O copia y pega este enlace en tu navegador:</p>
        <p style="color: #666; word-break: break-all;">${resetUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          Este enlace expirará en 1 hora. Si no solicitaste este cambio, ignora este email.
        </p>
      </div>
    `;

    const mailUser = process.env.MAIL_USER?.trim();
    const mailPass = process.env.MAIL_PASS?.trim();
    const isDev = process.env.NODE_ENV !== 'production';

    // Verificar configuración de correo
    if (!mailUser || !mailPass) {
      console.warn(
        '⚠️ [ADVERTENCIA] MAIL_USER o MAIL_PASS no están configurados en el .env',
      );
      console.warn(
        '📧 Para habilitar el envío de correos, configura en tu .env:',
      );
      console.warn('   MAIL_USER=tu_correo@gmail.com');
      console.warn('   MAIL_PASS=tu_contraseña_de_aplicacion');
      console.warn('\n🔗 Enlace de recuperación (solo para desarrollo):');
      console.warn(`   ${resetUrl}\n`);
      
      // En desarrollo, no lanzamos error, solo mostramos el enlace
      if (isDev) {
        return { 
          message: 'Si el email existe, se enviará un enlace de recuperación',
          devMode: true,
          resetUrl: resetUrl // Solo en desarrollo para facilitar pruebas
        };
      } else {
        throw new BadRequestException(
          'El servicio de correo no está configurado. Contacta al administrador.'
        );
      }
    }

    // Intentar enviar el correo
    try {
      console.log(`📧 Intentando enviar correo de recuperación a: ${normalizedEmail}`);
      const result = await this.mailService.sendMail({
        to: normalizedEmail,
        subject: 'Recuperación de Contraseña - CRM Admisiones UTE',
        message: emailHtml,
      });
      console.log(`✅ Correo enviado exitosamente. MessageId: ${result.messageId}`);
    } catch (error: any) {
      console.error('❌ Error al enviar email de recuperación:', error);
      console.error('Detalles del error:', {
        message: error?.message,
        code: error?.code,
        response: error?.response,
      });
      
      // Proporcionar mensaje de error más específico
      let errorMessage = 'No se pudo enviar el email de recuperación';
      
      if (error?.message?.includes('Invalid login')) {
        errorMessage = 'Credenciales de correo inválidas. Verifica MAIL_USER y MAIL_PASS en el .env';
      } else if (error?.message?.includes('EAUTH')) {
        errorMessage = 'Error de autenticación. Verifica que MAIL_PASS sea una contraseña de aplicación de Gmail';
      } else if (error?.code === 'ECONNECTION') {
        errorMessage = 'Error de conexión con el servidor de correo. Verifica tu conexión a internet';
      } else if (error?.message) {
        errorMessage = `Error al enviar correo: ${error.message}`;
      }
      
      throw new BadRequestException(errorMessage);
    }

    return { message: 'Si el email existe, se enviará un enlace de recuperación' };
  }

  async resetPassword(token: string, newPassword: string) {
    // Buscar usuario por token
    const usuario = await this.usuarioService.findByResetToken(token);
    
    if (!usuario) {
      throw new BadRequestException('Token inválido o expirado');
    }

    // Verificar que el token no haya expirado
    if (!usuario.fecha_expiracion_reset || usuario.fecha_expiracion_reset < new Date()) {
      await this.usuarioService.clearResetToken(usuario.id_usuario);
      throw new BadRequestException('El token ha expirado. Por favor, solicita un nuevo enlace de recuperación');
    }

    // Actualizar contraseña y limpiar token
    await this.usuarioService.update(usuario.id_usuario, {
      password: newPassword,
    });
    
    await this.usuarioService.clearResetToken(usuario.id_usuario);

    return { message: 'Contraseña restablecida exitosamente' };
  }
}