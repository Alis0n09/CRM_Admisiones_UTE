import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  IPaginationOptions,
  Pagination,
} from 'nestjs-typeorm-paginate';

import { ContactoAspirante } from './entities/contacto_aspirante.entity';
import { CreateContactoAspiranteDto } from './dto/create-contacto_aspirante.dto';
import { UpdateContactoAspiranteDto } from './dto/update-contacto_aspirante.dto';

@Injectable()
export class ContactoAspiranteService {
  constructor(
    @InjectRepository(ContactoAspirante)
    private readonly contactoAspiranteRepository: Repository<ContactoAspirante>,
  ) {}

 
  async create(
    createDto: CreateContactoAspiranteDto,
  ): Promise<ContactoAspirante | null> {
    try {
     
      const existe = await this.contactoAspiranteRepository.findOne({
        where: {
          id_contacto: createDto.id_contacto,
          id_aspirante: createDto.id_aspirante,
        },
      });

      if (existe) {
        return existe; 
      }

      const contactoAspirante =
        this.contactoAspiranteRepository.create(createDto);

      return await this.contactoAspiranteRepository.save(contactoAspirante);
    } catch (error) {
      console.error(
        'Error al crear el vínculo contacto-aspirante',
        error,
      );
      return null;
    }
  }


  async findAll(
    options: IPaginationOptions,
  ): Promise<Pagination<ContactoAspirante>> {
    const queryBuilder = this.contactoAspiranteRepository
      .createQueryBuilder('ca')
      
      .leftJoinAndSelect('ca.contacto', 'contacto')
      .leftJoinAndSelect('ca.aspirante', 'aspirante')
      .orderBy('ca.fecha_vinculo', 'DESC');

    return paginate<ContactoAspirante>(queryBuilder, options);
  }


  async findOne(
    id_contacto_aspirante: string,
  ): Promise<ContactoAspirante | null> {
    try {
      return await this.contactoAspiranteRepository
        .createQueryBuilder('ca')
        .leftJoinAndSelect('ca.contacto', 'contacto')
        .leftJoinAndSelect('ca.aspirante', 'aspirante')
        .where('ca.id_contacto_aspirante = :id', {
          id: id_contacto_aspirante,
        })
        .getOne();
    } catch (error) {
      console.error(
        'Error al buscar el vínculo contacto-aspirante',
        error,
      );
      return null;
    }
  }


  async update(
    id_contacto_aspirante: string,
    updateDto: UpdateContactoAspiranteDto,
  ): Promise<ContactoAspirante | null> {
    try {
      const contactoAspirante =
        await this.contactoAspiranteRepository.findOne({
          where: { id_contacto_aspirante },
        });

      if (!contactoAspirante) return null;

      Object.assign(contactoAspirante, updateDto);

      return await this.contactoAspiranteRepository.save(contactoAspirante);
    } catch (error) {
      console.error(
        'Error al actualizar el vínculo contacto-aspirante',
        error,
      );
      return null;
    }
  }


  async remove(
    id_contacto_aspirante: string,
  ): Promise<ContactoAspirante | null> {
    try {
      const contactoAspirante =
        await this.contactoAspiranteRepository.findOne({
          where: { id_contacto_aspirante },
        });

      if (!contactoAspirante) return null;

      return await this.contactoAspiranteRepository.remove(contactoAspirante);
    } catch (error) {
      console.error(
        'Error al eliminar el vínculo contacto-aspirante',
        error,
      );
      return null;
    }
  }
}

