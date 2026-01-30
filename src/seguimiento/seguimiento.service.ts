import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions, Pagination} from 'nestjs-typeorm-paginate';
import { Seguimiento } from './entities/seguimiento.entity';
import { CreateSeguimientoDto } from './dto/create-seguimiento.dto';
import { UpdateSeguimientoDto } from './dto/update-seguimiento.dto';

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
      const { id_cliente, ...resto } = createSeguimientoDto;

      const seguimiento = this.seguimientoRepository.create({
        ...resto,
        cliente: { id_cliente } as any,
      });

      return await this.seguimientoRepository.save(seguimiento);
    } catch (error) {
      return null;
    }
  }

  async findAll(options: IPaginationOptions & { id_cliente?: string }): Promise<Pagination<Seguimiento>> {
    const queryBuilder =
      this.seguimientoRepository.createQueryBuilder('seguimiento');

    queryBuilder
      .leftJoinAndSelect('seguimiento.cliente', 'cliente')
      .orderBy('seguimiento.fecha_contacto', 'DESC');

    if (options.id_cliente) {
      queryBuilder.andWhere('cliente.id_cliente = :id_cliente', { id_cliente: options.id_cliente });
    }

    const { id_cliente, ...paginationOptions } = options;
    return paginate<Seguimiento>(queryBuilder, paginationOptions);
  }

  async findOne(id_seguimiento: string): Promise<Seguimiento | null> {
    try {
      return await this.seguimientoRepository.findOne({
        where: { id_seguimiento },
        relations: ['cliente'],
      });
    } catch (error) {
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
        relations: ['cliente'],
      });

      if (!seguimiento) return null;

      if (updateSeguimientoDto.id_cliente) {
        (seguimiento as any).cliente = {
          id_cliente: updateSeguimientoDto.id_cliente,
        } as any;
        delete (updateSeguimientoDto as any).id_cliente;
      }

      Object.assign(seguimiento, updateSeguimientoDto);
      return await this.seguimientoRepository.save(seguimiento);
    } catch (error) {
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
      return null;
    }
  }
}
