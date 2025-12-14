import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';

import { ExamenAdmision } from './entities/examen_admision.entity';
import { CreateExamenAdmisionDto } from './dto/create-examen_admision.dto';
import { UpdateExamenAdmisionDto } from './dto/update-examen_admision.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class ExamenAdmisionService {
  constructor(
    @InjectRepository(ExamenAdmision)
    private readonly examenRepository: Repository<ExamenAdmision>,
  ) {}

  async create(dto: CreateExamenAdmisionDto): Promise<ExamenAdmision> {
    const examen = this.examenRepository.create(dto);
    return this.examenRepository.save(examen);
  }

  async findAll(query: QueryDto): Promise<Pagination<ExamenAdmision>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const qb = this.examenRepository.createQueryBuilder('examen')
      .orderBy('examen.fecha_programada', 'DESC');

    return paginate<ExamenAdmision>(qb, { page, limit });
  }

  async findOne(id_examen: string): Promise<ExamenAdmision> {
    const examen = await this.examenRepository.findOne({ where: { id_examen } });
    if (!examen) throw new NotFoundException('Examen no encontrado');
    return examen;
  }

  async update(
    id_examen: string,
    dto: UpdateExamenAdmisionDto,
  ): Promise<ExamenAdmision> {
    const examen = await this.examenRepository.findOne({ where: { id_examen } });
    if (!examen) throw new NotFoundException('Examen no encontrado');

    examen.nombre_examen = dto.nombre_examen;
    examen.descripcion = dto.descripcion;
    examen.fecha_programada = dto.fecha_programada;
    examen.duracion_minutos = dto.duracion_minutos;
    examen.puntaje_minimo = dto.puntaje_minimo;

    return this.examenRepository.save(examen);
  }

  async remove(id_examen: string): Promise<ExamenAdmision> {
    const examen = await this.examenRepository.findOne({ where: { id_examen } });
    if (!examen) throw new NotFoundException('Examen no encontrado');

    await this.examenRepository.remove(examen);
    return examen;
  }
}
