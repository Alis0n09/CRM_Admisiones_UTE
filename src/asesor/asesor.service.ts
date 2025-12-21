import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  IPaginationOptions,
  Pagination,
} from 'nestjs-typeorm-paginate';

import { Asesor } from './entities/asesor.entity';
import { CreateAsesorDto } from './dto/create-asesor.dto';
import { UpdateAsesorDto } from './dto/update-asesor.dto';

@Injectable()
export class AsesorService {
  constructor(
    @InjectRepository(Asesor)
    private readonly asesorRepository: Repository<Asesor>,
  ) {}


  async create(createAsesorDto: CreateAsesorDto): Promise<Asesor | null> {
    try {
      const asesor = this.asesorRepository.create(createAsesorDto);
      return await this.asesorRepository.save(asesor);
    } catch (error) {
      console.error('Error al crear el asesor:', error);
      return null;
    }
  }


  async findAll(options: IPaginationOptions): Promise<Pagination<Asesor>> {
    const qb = this.asesorRepository.createQueryBuilder('asesor');
    qb.orderBy('asesor.nombres', 'ASC');

    return paginate<Asesor>(qb, options);
  }


  async findOne(id_asesor: string): Promise<Asesor | null> {
    try {
      return await this.asesorRepository.findOne({
        where: { id_asesor: id_asesor },
      });
    } catch (error) {
      console.error('Error al buscar el asesor:', error);
      return null;
    }
  }


  async update(
    id_asesor: string,
    updateDto: UpdateAsesorDto,
  ): Promise<Asesor | null> {
    try {
      const asesor = await this.asesorRepository.findOne({
        where: { id_asesor: id_asesor },
      });

      if (!asesor) return null;

      Object.assign(asesor, updateDto);

      return await this.asesorRepository.save(asesor);
    } catch (error) {
      console.error('Error al actualizar el asesor:', error);
      return null;
    }
  }

  
  async remove(id_asesor: string): Promise<Asesor | null> {
    try {
      const asesor = await this.asesorRepository.findOne({
        where: { id_asesor: id_asesor },
      });

      if (!asesor) return null;

      return await this.asesorRepository.remove(asesor);
    } catch (error) {
      console.error('Error al eliminar el asesor:', error);
      return null;
    }
  }
}
