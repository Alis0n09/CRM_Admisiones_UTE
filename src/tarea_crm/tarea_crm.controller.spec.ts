import { Test, TestingModule } from '@nestjs/testing';
import { TareaCrmController } from './tarea_crm.controller';
import { TareaCrmService } from './tarea_crm.service';

describe('TareaCrmController', () => {
  let controller: TareaCrmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TareaCrmController],
      providers: [TareaCrmService],
    }).compile();

    controller = module.get<TareaCrmController>(TareaCrmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
