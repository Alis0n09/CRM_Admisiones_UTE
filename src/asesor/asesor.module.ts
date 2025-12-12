import { Module } from '@nestjs/common';
import { AsesorService } from './asesor.service';
import { AsesorController } from './asesor.controller';
import { Asesor } from './entities/asesor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Asesor])],
  controllers: [AsesorController],
  providers: [AsesorService],
})
export class AsesorModule {}
