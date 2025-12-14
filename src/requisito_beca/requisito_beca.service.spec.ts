import { Test, TestingModule } from '@nestjs/testing';
import { RequisitoBecaService } from './requisito_beca.service';

describe('RequisitoBecaService', () => {
  let service: RequisitoBecaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequisitoBecaService],
    }).compile();

    service = module.get<RequisitoBecaService>(RequisitoBecaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
