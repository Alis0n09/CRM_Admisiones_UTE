import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BecaEstudiante } from './entities/beca_estudiante.entity';
import { BecaEstudianteService } from './beca_estudiante.service';
import { BecaEstudianteController } from './beca_estudiante.controller';

import { Beca } from 'src/beca/entities/beca.entity';
import { Aspirante } from 'src/aspirante/entities/aspirante.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BecaEstudiante, Beca, Aspirante]),
  ],
  controllers: [BecaEstudianteController],
  providers: [BecaEstudianteService],
})
export class BecaEstudianteModule {}
