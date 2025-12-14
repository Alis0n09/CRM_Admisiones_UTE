import { Test, TestingModule } from '@nestjs/testing';
import { ExamenAdmisionService } from './examen_admision.service';

describe('ExamenAdmisionService', () => {
  let service: ExamenAdmisionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExamenAdmisionService],
    }).compile();

    service = module.get<ExamenAdmisionService>(ExamenAdmisionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
