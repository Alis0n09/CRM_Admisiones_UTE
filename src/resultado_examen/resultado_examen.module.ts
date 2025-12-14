import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultadoExamen } from './entities/resultado_examen.entity';
import { ResultadoExamenService } from './resultado_examen.service';
import { ResultadoExamenController } from './resultado_examen.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ResultadoExamen])],
  controllers: [ResultadoExamenController],
  providers: [ResultadoExamenService],
})
export class ResultadoExamenModule {}
