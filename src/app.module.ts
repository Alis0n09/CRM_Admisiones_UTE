import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactoModule } from './contacto/contacto.module';
import { TareaCrmModule } from './tarea_crm/tarea_crm.module';
import { AsesorModule } from './asesor/asesor.module';
import { SeguimientoModule } from './seguimiento/seguimiento.module';
import { CarreraModule } from './carrera/carrera.module';
import { AspiranteModule } from './aspirante/aspirante.module';
import { PostulacionModule } from './postulacion/postulacion.module'; 
import { Aspirante } from './aspirante/entities/aspirante.entity';
import { AspiranteModule } from './aspirante/aspirante.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      // ssl: { rejectUnauthorized: false },
    }),
    ContactoModule,
    TareaCrmModule,
    AsesorModule,
    SeguimientoModule,
    CarreraModule,
    AspiranteModule,
    PostulacionModule
    AspiranteModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}