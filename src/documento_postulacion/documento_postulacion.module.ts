import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentosPostulacion } from './entities/documento_postulacion.entity';
import { DocumentosPostulacionService } from './documento_postulacion.service';
import { DocumentosPostulacionController } from './documento_postulacion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentosPostulacion])],
  controllers: [DocumentosPostulacionController],
  providers: [DocumentosPostulacionService],
})
export class DocumentosPostulacionModule {}
