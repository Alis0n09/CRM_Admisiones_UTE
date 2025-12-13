import { Module } from '@nestjs/common';
import { MatriculaService } from './matricula.service';
import { MatriculaController } from './matricula.controller';
import { Matricula } from './entities/matricula.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Matricula])],
  controllers: [MatriculaController],
  providers: [MatriculaService],
})
export class MatriculaModule {}
