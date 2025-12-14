import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultadoExamen } from './entities/resultado_examen.entity';
import { ResultadoExamenService } from './resultado_examen.service';
import { ResultadoExamenController } from './resultado_examen.controller';
import { Postulacion } from 'src/postulacion/entities/postulacion.entity';
import { ExamenAdmision } from 'src/examen_admision/entities/examen_admision.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ResultadoExamen, Postulacion, ExamenAdmision])],
  controllers: [ResultadoExamenController],
  providers: [ResultadoExamenService],
})
export class ResultadoExamenModule {}
