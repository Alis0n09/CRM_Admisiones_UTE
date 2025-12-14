import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamenAdmisionService } from './examen_admision.service';
import { ExamenAdmisionController } from './examen_admision.controller';
import { ExamenAdmision } from './entities/examen_admision.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExamenAdmision])],
  controllers: [ExamenAdmisionController],
  providers: [ExamenAdmisionService],
})
export class ExamenAdmisionModule {}
