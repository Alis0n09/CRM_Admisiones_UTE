import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ContactoAspiranteService } from './contacto_aspirante.service';
import { ContactoAspiranteController } from './contacto_aspirante.controller';
import { ContactoAspirante } from './entities/contacto_aspirante.entity';

import { Contacto } from 'src/contacto/entities/contacto.entity'; 
import { Aspirante } from 'src/aspirante/entities/aspirante.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([ContactoAspirante, Contacto, Aspirante])],
  controllers: [ContactoAspiranteController],
  providers: [ContactoAspiranteService],
})
export class ContactoAspiranteModule {}
