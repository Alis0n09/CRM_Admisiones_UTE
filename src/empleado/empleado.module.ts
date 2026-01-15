import { Module } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { EmpleadoController } from './empleado.controller';
import { Empleado } from './entities/empleado.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Empleado])],
  controllers: [EmpleadoController],
  providers: [EmpleadoService],
})
export class EmpleadoModule {}
