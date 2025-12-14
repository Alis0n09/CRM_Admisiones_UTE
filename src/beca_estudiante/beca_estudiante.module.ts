import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BecaEstudianteService } from './beca_estudiante.service';
import { BecaEstudianteController } from './beca_estudiante.controller';
import { BecaEstudiante } from './entities/beca_estudiante.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BecaEstudiante])],
  controllers: [BecaEstudianteController],
  providers: [BecaEstudianteService],
})
export class BecaEstudianteModule {}
