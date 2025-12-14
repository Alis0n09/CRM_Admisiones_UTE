import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Auditoria } from './entities/auditoria.entity';
import { CreateAuditoriaDto } from './dto/create-auditoria.dto';
import { UpdateAuditoriaDto } from './dto/update-auditoria.dto';

@Injectable()
export class AuditoriaService {
  constructor(
    @InjectRepository(Auditoria)
    private readonly auditoriaRepository: Repository<Auditoria>,
  ) {}

  async create(dto: CreateAuditoriaDto): Promise<Auditoria | null> {
    try {
      const auditoria = this.auditoriaRepository.create(dto);
      return await this.auditoriaRepository.save(auditoria);
    } catch (error) {
      console.error('Error al crear auditoría', error);
      return null;
    }
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Auditoria>> {
    const queryBuilder = this.auditoriaRepository.createQueryBuilder('auditoria');
    queryBuilder.orderBy('auditoria.fecha_accion', 'DESC');
    return paginate<Auditoria>(queryBuilder, options);
  }

  async findOne(id_auditoria: string): Promise<Auditoria | null> {
    try {
      return await this.auditoriaRepository.findOne({ where: { id_auditoria } });
    } catch (error) {
      console.error('Error al buscar auditoría', error);
      return null;
    }
  }

  async update(id_auditoria: string, dto: UpdateAuditoriaDto): Promise<Auditoria | null> {
    try {
      const auditoria = await this.auditoriaRepository.findOne({ where: { id_auditoria } });
      if (!auditoria) return null;
      Object.assign(auditoria, dto);
      return await this.auditoriaRepository.save(auditoria);
    } catch (error) {
      console.error('Error al actualizar auditoría', error);
      return null;
    }
  }

  async remove(id_auditoria: string): Promise<Auditoria | null> {
    try {
      const auditoria = await this.auditoriaRepository.findOne({ where: { id_auditoria } });
      if (!auditoria) return null;
      return await this.auditoriaRepository.remove(auditoria);
    } catch (error) {
      console.error('Error al eliminar auditoría', error);
      return null;
    }
  }
}
