import { Test, TestingModule } from '@nestjs/testing';
import { ContactoAspiranteController } from './contacto_aspirante.controller';
import { ContactoAspiranteService } from './contacto_aspirante.service';

describe('ContactoAspiranteController', () => {
  let controller: ContactoAspiranteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactoAspiranteController],
      providers: [ContactoAspiranteService],
    }).compile();

    controller = module.get<ContactoAspiranteController>(ContactoAspiranteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
