import { Test, TestingModule } from '@nestjs/testing';
import { ResultadoExamenController } from './resultado_examen.controller';
import { ResultadoExamenService } from './resultado_examen.service';

describe('ResultadoExamenController', () => {
  let controller: ResultadoExamenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResultadoExamenController],
      providers: [ResultadoExamenService],
    }).compile();

    controller = module.get<ResultadoExamenController>(ResultadoExamenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
