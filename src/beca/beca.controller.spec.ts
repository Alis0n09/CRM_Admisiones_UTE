import { Test, TestingModule } from '@nestjs/testing';
import { BecaController } from './beca.controller';
import { BecaService } from './beca.service';

describe('BecaController', () => {
  let controller: BecaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BecaController],
      providers: [BecaService],
    }).compile();

    controller = module.get<BecaController>(BecaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
