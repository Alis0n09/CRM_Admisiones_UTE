import { Test, TestingModule } from '@nestjs/testing';
import { RequisitoBecaController } from './requisito_beca.controller';
import { RequisitoBecaService } from './requisito_beca.service';

describe('RequisitoBecaController', () => {
  let controller: RequisitoBecaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequisitoBecaController],
      providers: [RequisitoBecaService],
    }).compile();

    controller = module.get<RequisitoBecaController>(RequisitoBecaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
