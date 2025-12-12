import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seguimiento } from './entities/seguimiento.entity';
import { SeguimientoService } from './seguimiento.service';
import { SeguimientoController } from './seguimiento.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Seguimiento])],
  controllers: [SeguimientoController],
  providers: [SeguimientoService],
  exports: [SeguimientoService],
})
export class SeguimientoModule {}
