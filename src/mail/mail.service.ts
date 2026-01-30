import * as nodemailer from 'nodemailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SendMailDto } from './dto/send-mail.dto';
import axios from 'axios';

@Injectable()
export class MailService {
  private checkMailConfig(): void {
    const user = process.env.MAIL_USER?.trim();
    const pass = process.env.MAIL_PASS?.trim();
    if (!user || !pass) {
      throw new InternalServerErrorException(
        'Configuración de correo incompleta. Añade MAIL_USER y MAIL_PASS en el .env del backend. ' +
          'Para Gmail: usa tu correo y una contraseña de aplicación (no la contraseña normal). ' +
          'Crear en: Cuenta Google → Seguridad → Verificación en 2 pasos → Contraseñas de aplicación.',
      );
    }
  }

  async sendMail(dto: SendMailDto) {
    this.checkMailConfig();

    const mailUser = process.env.MAIL_USER!.trim();
    const mailPass = process.env.MAIL_PASS!.trim();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: mailUser,
        pass: mailPass,
      },
    });

    // Verificar la conexión antes de enviar
    try {
      await transporter.verify();
      console.log('✅ Servidor de correo verificado correctamente');
    } catch (error: any) {
      console.error('❌ Error al verificar servidor de correo:', error);
      if (error?.code === 'EAUTH') {
        throw new InternalServerErrorException(
          'Error de autenticación con Gmail. Verifica que:\n' +
          '1. MAIL_USER sea tu correo de Gmail completo\n' +
          '2. MAIL_PASS sea una contraseña de aplicación (no tu contraseña normal)\n' +
          '3. Para crear una contraseña de aplicación: Cuenta Google → Seguridad → Verificación en 2 pasos → Contraseñas de aplicación'
        );
      }
      throw error;
    }

    try {
      console.log(`📤 Enviando correo a: ${dto.to}`);
      const info = await transporter.sendMail({
        from: `"CRM Admisiones UTE" <${mailUser}>`,
        to: dto.to,
        subject: dto.subject,
        html: dto.message,
      });
      console.log(`✅ Correo enviado. MessageId: ${info.messageId}`);
      return { messageId: info.messageId };
    } catch (error: any) {
      console.error('❌ Error al enviar correo:', {
        code: error?.code,
        command: error?.command,
        response: error?.response,
        message: error?.message,
      });
      
      let errorMessage = 'No se pudo enviar el correo';
      
      if (error?.code === 'EAUTH') {
        errorMessage = 'Error de autenticación. Verifica MAIL_USER y MAIL_PASS (debe ser contraseña de aplicación de Gmail)';
      } else if (error?.code === 'ECONNECTION') {
        errorMessage = 'Error de conexión con el servidor de correo';
      } else if (error?.response) {
        errorMessage = `Error del servidor: ${error.response}`;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      throw new InternalServerErrorException(errorMessage);
    }
  }
  async fetchUserListFromPublicApi() {
    const res = await axios.get('https://jsonplaceholder.typicode.com/users');
    return res.data;
  }
}