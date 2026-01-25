import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  IPaginationOptions,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Carrera } from './entities/carrera.entity';
import { CreateCarreraDto } from './dto/create-carrera.dto';
import { UpdateCarreraDto } from './dto/update-carrera.dto';

@Injectable()
export class CarreraService {
  constructor(
    @InjectRepository(Carrera)
    private readonly carreraRepository: Repository<Carrera>,
  ) {}

 
  async create(
    createCarreraDto: CreateCarreraDto,
  ): Promise<Carrera | null> {
    try {
      const carrera = this.carreraRepository.create(createCarreraDto);
      return await this.carreraRepository.save(carrera);
    } catch (error) {
      return null;
    }
  }


  async findAll(
    options: IPaginationOptions,
  ): Promise<Pagination<Carrera>> {
    const queryBuilder =
      this.carreraRepository.createQueryBuilder('carrera');

    queryBuilder.orderBy('carrera.nombre_carrera', 'ASC');

    return paginate<Carrera>(queryBuilder, options);
  }


  async findOne(id_carrera: string): Promise<Carrera | null> {
    try {
      return await this.carreraRepository.findOne({
        where: { id_carrera },
      });
    } catch (error) {
      return null;
    }
  }


  async update(
    id_carrera: string,
    updateCarreraDto: UpdateCarreraDto,
  ): Promise<Carrera | null> {
    try {
      const carrera = await this.carreraRepository.findOne({
        where: { id_carrera },
      });

      if (!carrera) return null;

      Object.assign(carrera, updateCarreraDto);
      return await this.carreraRepository.save(carrera);
    } catch (error) {
      return null;
    }
  }

  
  async remove(id_carrera: string): Promise<Carrera | null> {
    try {
      const carrera = await this.carreraRepository.findOne({
        where: { id_carrera },
      });

      if (!carrera) return null;

      return await this.carreraRepository.remove(carrera);
    } catch (error) {
      return null;
    }
  }
}
