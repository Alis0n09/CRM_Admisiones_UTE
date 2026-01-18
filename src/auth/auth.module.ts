import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsuarioModule } from 'src/usuario/usuario.module';

@Module({
  imports: [
    ConfigModule,
    UsuarioModule,

    // ✅ ESTO REGISTRA LA ESTRATEGIA "jwt" EN PASSPORT
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
  // ✅ METE LA STRATEGY AQUÍ
  providers: [AuthService, JwtStrategy],

  // ✅ RECOMENDADO (para que otros módulos usen auth sin líos)
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}