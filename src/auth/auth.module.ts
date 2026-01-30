import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    ConfigModule,
    UsuarioModule,
    MailModule,

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        secret: config.get<string>('JWT_SECRET') as string,
        signOptions: {
          expiresIn: parseInt(config.get<string>('JWT_EXPIRES_IN') ?? '3600', 10),
        },
      }),
    }),
  ],
  controllers: [AuthController],

  providers: [AuthService, JwtStrategy],


  exports: [PassportModule, JwtModule],
})
export class AuthModule {}