import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

import { TareaCrm } from './entities/tarea_crm.entity';
import { CreateTareaDto } from './dto/create-tarea_crm.dto'; 
import { UpdateTareaDto } from './dto/update-tarea_crm.dto'; 

import { Empleado } from 'src/empleado/entities/empleado.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity';

@Injectable()
export class TareaCrmService {
  constructor(
    @InjectRepository(TareaCrm)
    private readonly tareaRepository: Repository<TareaCrm>,
  ) {}

  async create(createTareaDto: CreateTareaDto): Promise<TareaCrm | null> {
    try {
      const { id_empleado, id_cliente, ...resto } = createTareaDto;

      const tarea = this.tareaRepository.create({
        ...resto,
        empleado: { id_empleado } as Empleado,
        cliente: { id_cliente } as Cliente,
      });

      return await this.tareaRepository.save(tarea);
    } catch (error) {
      return null;
    }
  }

  async findAll(options: IPaginationOptions & { id_empleado?: string; id_cliente?: string }): Promise<Pagination<TareaCrm>> {
    const queryBuilder = this.tareaRepository.createQueryBuilder('tarea');

    queryBuilder
      .leftJoinAndSelect('tarea.empleado', 'empleado')
      .leftJoinAndSelect('tarea.cliente', 'cliente')
      .orderBy('tarea.fecha_asignacion', 'DESC');

    if (options.id_empleado) {
      queryBuilder.andWhere('empleado.id_empleado = :id_empleado', { id_empleado: options.id_empleado });
    }

    if (options.id_cliente) {
      queryBuilder.andWhere('cliente.id_cliente = :id_cliente', { id_cliente: options.id_cliente });
    }

    const { id_empleado, id_cliente, ...paginationOptions } = options;
    return paginate<TareaCrm>(queryBuilder, paginationOptions);
  }

  async findOne(id_tarea: string): Promise<TareaCrm | null> {
    try {
      return await this.tareaRepository.findOne({
        where: { id_tarea },
        relations: ['empleado', 'cliente'],
      });
    } catch (error) {
      return null;
    }
  }

  async update(
    id_tarea: string,
    updateTareaDto: UpdateTareaDto,
  ): Promise<TareaCrm | null> {
    try {
      const tarea = await this.tareaRepository.findOne({
        where: { id_tarea },
        relations: ['empleado', 'cliente'],
      });

      if (!tarea) return null;

      if (updateTareaDto.id_empleado) {
        (tarea as any).empleado = { id_empleado: updateTareaDto.id_empleado } as Empleado;
        delete (updateTareaDto as any).id_empleado;
      }

      if (updateTareaDto.id_cliente) {
        (tarea as any).cliente = { id_cliente: updateTareaDto.id_cliente } as Cliente;
        delete (updateTareaDto as any).id_cliente;
      }

      Object.assign(tarea, updateTareaDto);

      return await this.tareaRepository.save(tarea);
    } catch (error) {
      return null;
    }
  }

  async remove(id_tarea: string): Promise<TareaCrm | null> {
    try {
      const tarea = await this.tareaRepository.findOne({
        where: { id_tarea },
      });

      if (!tarea) return null;

      return await this.tareaRepository.remove(tarea);
    } catch (error) {
      return null;
    }
  }
}
