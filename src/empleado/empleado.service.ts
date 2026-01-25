import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  IPaginationOptions,
  Pagination,
} from 'nestjs-typeorm-paginate';

import { Empleado } from './entities/empleado.entity';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';

@Injectable()
export class EmpleadoService {
  constructor(
    @InjectRepository(Empleado)
    private readonly empleadoRepository: Repository<Empleado>,
  ) {}


  async create(createEmpleadoDto: CreateEmpleadoDto): Promise<Empleado | null> {
    try {
      const empleado = this.empleadoRepository.create(createEmpleadoDto);
      return await this.empleadoRepository.save(empleado);
    } catch (error) {
      return null;
    }
  }


  async findAll(options: IPaginationOptions): Promise<Pagination<Empleado>> {
    const qb = this.empleadoRepository.createQueryBuilder('empleado');
    qb.orderBy('empleado.nombres', 'ASC');

    return paginate<Empleado>(qb, options);
  }


  async findOne(id_empleado: string): Promise<Empleado | null> {
    try {
      return await this.empleadoRepository.findOne({
        where: { id_empleado: id_empleado },
      });
    } catch (error) {
      return null;
    }
  }


  async update(
    id_empleado: string,
    updateDto: UpdateEmpleadoDto,
  ): Promise<Empleado | null> {
    try {
      const empleado = await this.empleadoRepository.findOne({
        where: { id_empleado: id_empleado },
      });

      if (!empleado) return null;

      Object.assign(empleado, updateDto);

      return await this.empleadoRepository.save(empleado);
    } catch (error) {
      return null;
    }
  }

  
  async remove(id_empleado: string): Promise<Empleado | null> {
    try {
      const empleado = await this.empleadoRepository.findOne({
        where: { id_empleado: id_empleado },
      });

      if (!empleado) return null;

      return await this.empleadoRepository.remove(empleado);
    } catch (error) {
      return null;
    }
  }
}
