import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  IPaginationOptions,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Aspirante } from './entities/aspirante.entity';
import { CreateAspiranteDto } from './dto/create-aspirante.dto';
import { UpdateAspiranteDto } from './dto/update-aspirante.dto';

@Injectable()
export class AspiranteService {
  constructor(
    @InjectRepository(Aspirante)
    private readonly aspiranteRepository: Repository<Aspirante>,
  ) {}


async create(createAspiranteDto: CreateAspiranteDto): Promise<Aspirante | null> {
  try {
    const { id_contacto, ...resto } = createAspiranteDto;

    const aspirante = this.aspiranteRepository.create({
      ...resto,
      contacto: { id_contacto } as any,
    });

    return await this.aspiranteRepository.save(aspirante);
  } catch (error) {
    console.error('Error al crear el aspirante', error);
    return null;
  }
}

  
  async findAll(
    options: IPaginationOptions,
  ): Promise<Pagination<Aspirante>> {
    const queryBuilder =
      this.aspiranteRepository.createQueryBuilder('aspirante');
    queryBuilder.orderBy('aspirante.fecha_registro', 'DESC');
    return paginate<Aspirante>(queryBuilder, options);
  }


  async findOne(id_aspirante: string): Promise<Aspirante | null> {
    try {
      return await this.aspiranteRepository.findOne({
        where: { id_aspirante },
      });
    } catch (error) {
      console.error('Error al buscar el aspirante', error);
      return null;
    }
  }

  
  async update(
    id_aspirante: string,
    updateAspiranteDto: UpdateAspiranteDto,
  ): Promise<Aspirante | null> {
    try {
      const aspirante = await this.aspiranteRepository.findOne({
        where: { id_aspirante },
      });
      if (!aspirante) return null;
      Object.assign(aspirante, updateAspiranteDto);
      return await this.aspiranteRepository.save(aspirante);
    } catch (error) {
      console.error('Error al actualizar el aspirante', error);
      return null;
    }
  }

  
  async remove(id_aspirante: string): Promise<Aspirante | null> {
    try {
      const aspirante = await this.aspiranteRepository.findOne({
        where: { id_aspirante },
      });
      if (!aspirante) return null;
      return await this.aspiranteRepository.remove(aspirante);
    } catch (error) {
      console.error('Error al eliminar el aspirante', error);
      return null;
    }
  }
}
