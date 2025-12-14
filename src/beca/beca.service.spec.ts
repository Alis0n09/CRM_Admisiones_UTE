import { Test, TestingModule } from '@nestjs/testing';
import { BecaService } from './beca.service';

describe('BecaService', () => {
  let service: BecaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BecaService],
    }).compile();

    service = module.get<BecaService>(BecaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
