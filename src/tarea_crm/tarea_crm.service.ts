import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

import { TareaCrm } from './entities/tarea_crm.entity';
import { CreateTareaDto } from './dto/create-tarea_crm.dto'; 
import { UpdateTareaDto } from './dto/update-tarea_crm.dto'; 

import { Asesor } from 'src/asesor/entities/asesor.entity';
import { Contacto } from 'src/contacto/entities/contacto.entity';

@Injectable()
export class TareaCrmService {
  constructor(
    @InjectRepository(TareaCrm)
    private readonly tareaRepository: Repository<TareaCrm>,
  ) {}

  
  async create(createTareaDto: CreateTareaDto): Promise<TareaCrm | null> {
    try {
      const { id_asesor, id_contacto, ...resto } = createTareaDto;

      const tarea = this.tareaRepository.create({
        ...resto,
        asesor: { id_asesor } as Asesor,
        contacto: { id_contacto } as Contacto,
      });

      return await this.tareaRepository.save(tarea);
    } catch (error) {
      console.error('Error al crear la tarea', error);
      return null;
    }
  }

 
  async findAll(options: IPaginationOptions): Promise<Pagination<TareaCrm>> {
    const queryBuilder = this.tareaRepository.createQueryBuilder('tarea');

    queryBuilder
      .leftJoinAndSelect('tarea.asesor', 'asesor')
      .leftJoinAndSelect('tarea.contacto', 'contacto')
      .orderBy('tarea.fecha_asignacion', 'DESC');

    return paginate<TareaCrm>(queryBuilder, options);
  }


  async findOne(id_tarea: string): Promise<TareaCrm | null> {
    try {
      return await this.tareaRepository.findOne({
        where: { id_tarea },
        relations: ['asesor', 'contacto'],
      });
    } catch (error) {
      console.error('Error al buscar la tarea', error);
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
        relations: ['asesor', 'contacto'],
      });

      if (!tarea) return null;

      
      if (updateTareaDto.id_asesor) {
        (tarea as any).asesor = { id_asesor: updateTareaDto.id_asesor } as Asesor;
        delete (updateTareaDto as any).id_asesor;
      }

      if (updateTareaDto.id_contacto) {
        (tarea as any).contacto = { id_contacto: updateTareaDto.id_contacto } as Contacto;
        delete (updateTareaDto as any).id_contacto;
      }

      Object.assign(tarea, updateTareaDto);

      return await this.tareaRepository.save(tarea);
    } catch (error) {
      console.error('Error al actualizar la tarea', error);
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
      console.error('Error al eliminar la tarea', error);
      return null;
    }
  }
}

