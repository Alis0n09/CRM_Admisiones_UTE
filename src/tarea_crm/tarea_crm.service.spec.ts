import { Test, TestingModule } from '@nestjs/testing';
import { TareaCrmService } from './tarea_crm.service';

describe('TareaCrmService', () => {
  let service: TareaCrmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TareaCrmService],
    }).compile();

    service = module.get<TareaCrmService>(TareaCrmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
