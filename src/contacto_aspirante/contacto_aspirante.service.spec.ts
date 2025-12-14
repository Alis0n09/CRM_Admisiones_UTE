import { Test, TestingModule } from '@nestjs/testing';
import { ContactoAspiranteService } from './contacto_aspirante.service';

describe('ContactoAspiranteService', () => {
  let service: ContactoAspiranteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactoAspiranteService],
    }).compile();

    service = module.get<ContactoAspiranteService>(ContactoAspiranteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
