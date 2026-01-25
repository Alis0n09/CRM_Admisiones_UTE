import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentosPostulacion } from './entities/documento_postulacion.entity';
import { DocumentosPostulacionService } from './documento_postulacion.service';
import { DocumentosPostulacionController } from './documento_postulacion.controller';
import { PostulacionModule } from 'src/postulacion/postulacion.module';
import { UploadsController } from './uploads.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentosPostulacion]),
    PostulacionModule,
  ],
  controllers: [DocumentosPostulacionController, UploadsController],
  providers: [DocumentosPostulacionService],
})
export class DocumentosPostulacionModule {}
