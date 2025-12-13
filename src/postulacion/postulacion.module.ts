import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostulacionService } from './postulacion.service';
import { PostulacionController } from './postulacion.controller';
import { Postulacion } from './entities/postulacion.entity';
import { Aspirante } from 'src/aspirante/entities/aspirante.entity';
import { Carrera } from 'src/carrera/entities/carrera.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Postulacion, Aspirante, Carrera])],
  controllers: [PostulacionController],
  providers: [PostulacionService],
})
export class PostulacionModule {}
