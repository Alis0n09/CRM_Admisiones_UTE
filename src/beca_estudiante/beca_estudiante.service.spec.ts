import { Test, TestingModule } from '@nestjs/testing';
import { BecaEstudianteService } from './beca_estudiante.service';

describe('BecaEstudianteService', () => {
  let service: BecaEstudianteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BecaEstudianteService],
    }).compile();

    service = module.get<BecaEstudianteService>(BecaEstudianteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
