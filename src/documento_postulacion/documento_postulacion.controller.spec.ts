import { Test, TestingModule } from '@nestjs/testing';
import { DocumentosPostulacionController } from './documento_postulacion.controller';
import { DocumentosPostulacionService } from './documento_postulacion.service';

describe('DocumentoPostulacionController', () => {
  let controller: DocumentosPostulacionController;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentosPostulacionController],
      providers: [
        {
          provide: DocumentosPostulacionService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<DocumentosPostulacionController>(
      DocumentosPostulacionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
