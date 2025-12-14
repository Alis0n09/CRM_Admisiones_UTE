import { Test, TestingModule } from '@nestjs/testing';
import { BecaEstudianteController } from './beca_estudiante.controller';
import { BecaEstudianteService } from './beca_estudiante.service';

describe('BecaEstudianteController', () => {
  let controller: BecaEstudianteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BecaEstudianteController],
      providers: [BecaEstudianteService],
    }).compile();

    controller = module.get<BecaEstudianteController>(BecaEstudianteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
