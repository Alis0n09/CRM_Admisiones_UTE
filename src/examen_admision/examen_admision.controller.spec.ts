import { Test, TestingModule } from '@nestjs/testing';
import { ExamenAdmisionController } from './examen_admision.controller';
import { ExamenAdmisionService } from './examen_admision.service';

describe('ExamenAdmisionController', () => {
  let controller: ExamenAdmisionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamenAdmisionController],
      providers: [ExamenAdmisionService],
    }).compile();

    controller = module.get<ExamenAdmisionController>(ExamenAdmisionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
