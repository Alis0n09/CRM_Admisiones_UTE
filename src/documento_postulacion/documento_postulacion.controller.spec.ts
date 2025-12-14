import { Test, TestingModule } from '@nestjs/testing';
import { DocumentoPostulacionController } from './documento_postulacion.controller';
import { DocumentoPostulacionService } from './documento_postulacion.service';

describe('DocumentoPostulacionController', () => {
  let controller: DocumentoPostulacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentoPostulacionController],
      providers: [DocumentoPostulacionService],
    }).compile();

    controller = module.get<DocumentoPostulacionController>(DocumentoPostulacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
