import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions, Pagination} from 'nestjs-typeorm-paginate';
import { Seguimiento } from './entities/seguimiento.entity';
import { CreateSeguimientoDto } from './dto/create-seguimiento.dto';
import { UpdateSeguimientoDto } from './dto/update-seguimiento.dto';
import { Contacto } from 'src/contacto/entities/contacto.entity';

@Injectable()
export class SeguimientoService {
  constructor(
    @InjectRepository(Seguimiento)
    private readonly seguimientoRepository: Repository<Seguimiento>,
  ) {}

 
  async create(
    createSeguimientoDto: CreateSeguimientoDto,
  ): Promise<Seguimiento | null> {
    try {
   
      const { id_contacto, ...resto } = createSeguimientoDto;

      const seguimiento = this.seguimientoRepository.create({
        ...resto,
        
        contacto: { id_contacto } as any,
      });

      return await this.seguimientoRepository.save(seguimiento);
    } catch (error) {
      console.error('Error al crear el seguimiento', error);
      return null;
    }
  }

  
  async findAll(options: IPaginationOptions): Promise<Pagination<Seguimiento>> {
    const queryBuilder =
      this.seguimientoRepository.createQueryBuilder('seguimiento');

  
    queryBuilder
      .leftJoinAndSelect('seguimiento.contacto', 'contacto')
      .orderBy('seguimiento.fecha_contacto', 'DESC');

    return paginate<Seguimiento>(queryBuilder, options);
  }

 
  async findOne(id_seguimiento: string): Promise<Seguimiento | null> {
    try {
      return await this.seguimientoRepository.findOne({
        where: { id_seguimiento },
        relations: ['contacto'],
      });
    } catch (error) {
      console.error('Error al buscar el seguimiento', error);
      return null;
    }
  }


  async update(
    id_seguimiento: string,
    updateSeguimientoDto: UpdateSeguimientoDto,
  ): Promise<Seguimiento | null> {
    try {
      const seguimiento = await this.seguimientoRepository.findOne({
        where: { id_seguimiento },
        relations: ['contacto'],
      });

      if (!seguimiento) return null;

   
      if (updateSeguimientoDto.id_contacto) {
        (seguimiento as any).contacto = {
          id_contacto: updateSeguimientoDto.id_contacto,
        } as any;
   
        delete (updateSeguimientoDto as any).id_contacto;
      }

      Object.assign(seguimiento, updateSeguimientoDto);
      return await this.seguimientoRepository.save(seguimiento);
    } catch (error) {
      console.error('Error al actualizar el seguimiento', error);
      return null;
    }
  }

  
  async remove(id_seguimiento: string): Promise<Seguimiento | null> {
    try {
      const seguimiento = await this.seguimientoRepository.findOne({
        where: { id_seguimiento },
      });
      if (!seguimiento) return null;
      return await this.seguimientoRepository.remove(seguimiento);
    } catch (error) {
      console.error('Error al eliminar el seguimiento', error);
      return null;
    }
  }
}
