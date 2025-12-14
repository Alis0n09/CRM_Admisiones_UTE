import { Test, TestingModule } from '@nestjs/testing';
import { DocumentoPostulacionService } from './documento_postulacion.service';

describe('DocumentoPostulacionService', () => {
  let service: DocumentoPostulacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentoPostulacionService],
    }).compile();

    service = module.get<DocumentoPostulacionService>(DocumentoPostulacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
