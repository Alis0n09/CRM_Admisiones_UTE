import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// 🔐 Guard JWT global
import { JwtAuthGuard } from './guards/jwt-auth.guard';

// 📋 Interceptor de auditoría
import { AuditoriaInterceptor } from './auditoria/auditoria.interceptor';

// 📦 Módulos
import { ClienteModule } from './cliente/cliente.module';
import { TareaCrmModule } from './tarea_crm/tarea_crm.module';
import { EmpleadoModule } from './empleado/empleado.module';
import { SeguimientoModule } from './seguimiento/seguimiento.module';
import { CarreraModule } from './carrera/carrera.module';
import { PostulacionModule } from './postulacion/postulacion.module';
import { MatriculaModule } from './matricula/matricula.module';
import { DocumentosPostulacionModule } from './documento_postulacion/documento_postulacion.module';
import { BecaModule } from './beca/beca.module';
import { BecaEstudianteModule } from './beca_estudiante/beca_estudiante.module';
import { UsuarioModule } from './usuario/usuario.module';
import { RolModule } from './rol/rol.module';
import { MailModule } from './mail/mail.module';
import { AuditoriaModule } from './auditoria/auditoria.module';
import { AuthModule } from './auth/auth.module';
import { RolUsuarioModule } from './rol_usuario/rol_usuario.module';
import { AuditoriaInterceptor } from './auditoria/auditoria.interceptor';

@Module({
  imports: [
    // 🌍 Variables de entorno globales
    ConfigModule.forRoot({ isGlobal: true }),

    // 🐘 PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // ⚠️ solo dev
    }),

    // 🍃 MongoDB
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/crm_admisiones_ute',
      { dbName: 'crm_admisiones_ute' },
    ),

    // 📦 Módulos de la app
    ClienteModule,
    TareaCrmModule,
    EmpleadoModule,
    SeguimientoModule,
    CarreraModule,
    PostulacionModule,
    MatriculaModule,
    DocumentosPostulacionModule,
    BecaModule,
    BecaEstudianteModule,
    UsuarioModule,
    RolModule,
    MailModule,
    AuditoriaModule,
    AuthModule,
    RolUsuarioModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    // 🔐 GUARD JWT GLOBAL (respeta @Public)
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    // 📋 INTERCEPTOR GLOBAL DE AUDITORÍA
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditoriaInterceptor,
    },
  ],
})
export class AppModule {}
