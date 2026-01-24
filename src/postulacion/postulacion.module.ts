import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostulacionService } from './postulacion.service';
import { PostulacionController } from './postulacion.controller';
import { Postulacion } from './entities/postulacion.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity'; 
import { Carrera } from 'src/carrera/entities/carrera.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Postulacion, Cliente, Carrera])],
  controllers: [PostulacionController],
  providers: [PostulacionService],
  exports: [PostulacionService],
})
export class PostulacionModule {}
