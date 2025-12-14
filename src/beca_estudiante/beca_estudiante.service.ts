import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

import { BecaEstudiante } from './entities/beca_estudiante.entity';
import { CreateBecaEstudianteDto } from './dto/create-beca_estudiante.dto';
import { UpdateBecaEstudianteDto } from './dto/update-beca_estudiante.dto';

@Injectable()
export class BecaEstudianteService {
  constructor(
    @InjectRepository(BecaEstudiante)
    private readonly becaEstudianteRepository: Repository<BecaEstudiante>,
  ) {}

  async create(
    dto: CreateBecaEstudianteDto,
  ): Promise<BecaEstudiante | null> {
    try {
      const existe = await this.becaEstudianteRepository.findOne({
        where: {
          id_beca: dto.id_beca,
          id_aspirante: dto.id_aspirante,
          periodo_academico: dto.periodo_academico,
        },
      });

      if (existe) return existe;

     
      const becaEstudiante = this.becaEstudianteRepository.create({
        id_beca: dto.id_beca,
        id_aspirante: dto.id_aspirante,
        fecha_asignacion: dto.fecha_asignacion,
        periodo_academico: dto.periodo_academico,
        monto_otorgado: dto.monto_otorgado.toString(), 
        estado: dto.estado ?? 'Vigente',
      });

      return await this.becaEstudianteRepository.save(becaEstudiante);
    } catch (error) {
      console.error('Error al crear beca_estudiante', error);
      return null;
    }
  }

  async findAll(
    options: IPaginationOptions,
  ): Promise<Pagination<BecaEstudiante>> {
    const queryBuilder = this.becaEstudianteRepository
      .createQueryBuilder('be')
      .leftJoinAndSelect('be.beca', 'beca')
      .leftJoinAndSelect('be.aspirante', 'aspirante')
      .orderBy('be.fecha_asignacion', 'DESC');

    return paginate<BecaEstudiante>(queryBuilder, options);
  }


  async findOne(
    id_beca_estudiante: string,
  ): Promise<BecaEstudiante | null> {
    try {
      return await this.becaEstudianteRepository
        .createQueryBuilder('be')
        .leftJoinAndSelect('be.beca', 'beca')
        .leftJoinAndSelect('be.aspirante', 'aspirante')
        .where('be.id_beca_estudiante = :id', { id: id_beca_estudiante })
        .getOne();
    } catch (error) {
      console.error('Error al buscar beca_estudiante', error);
      return null;
    }
  }


  async update(
    id_beca_estudiante: string,
    dto: UpdateBecaEstudianteDto,
  ): Promise<BecaEstudiante | null> {
    try {
      const becaEstudiante = await this.becaEstudianteRepository.findOne({
        where: { id_beca_estudiante },
      });

      if (!becaEstudiante) return null;

      if (dto.monto_otorgado !== undefined) {
        becaEstudiante.monto_otorgado = dto.monto_otorgado.toString();
      }

      Object.assign(becaEstudiante, dto);

      return await this.becaEstudianteRepository.save(becaEstudiante);
    } catch (error) {
      console.error('Error al actualizar beca_estudiante', error);
      return null;
    }
  }


  async remove(
    id_beca_estudiante: string,
  ): Promise<BecaEstudiante | null> {
    try {
      const becaEstudiante = await this.becaEstudianteRepository.findOne({
        where: { id_beca_estudiante },
      });

      if (!becaEstudiante) return null;

      return await this.becaEstudianteRepository.remove(becaEstudiante);
    } catch (error) {
      console.error('Error al eliminar beca_estudiante', error);
      return null;
    }
  }
}
