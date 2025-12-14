import { Test, TestingModule } from '@nestjs/testing';
import { ResultadoExamenService } from './resultado_examen.service';

describe('ResultadoExamenService', () => {
  let service: ResultadoExamenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResultadoExamenService],
    }).compile();

    service = module.get<ResultadoExamenService>(ResultadoExamenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
