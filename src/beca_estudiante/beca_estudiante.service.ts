import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BecaEstudiante } from './entities/beca_estudiante.entity';
import { CreateBecaEstudianteDto } from './dto/create-beca_estudiante.dto';
import { UpdateBecaEstudianteDto } from './dto/update-beca_estudiante.dto';

import { Beca } from 'src/beca/entities/beca.entity';
import { Aspirante } from 'src/aspirante/entities/aspirante.entity';

@Injectable()
export class BecaEstudianteService {
  constructor(
    @InjectRepository(BecaEstudiante)
    private readonly becaEstRepo: Repository<BecaEstudiante>,

    @InjectRepository(Beca)
    private readonly becaRepo: Repository<Beca>,

    @InjectRepository(Aspirante)
    private readonly aspiranteRepo: Repository<Aspirante>,
  ) {}


  async create(dto: CreateBecaEstudianteDto) {
    const beca = await this.becaRepo.findOneBy({ id_beca: dto.id_beca });
    if (!beca) throw new BadRequestException('La beca no existe');

    const aspirante = await this.aspiranteRepo.findOneBy({
      id_aspirante: dto.id_aspirante,
    });
    if (!aspirante)
      throw new BadRequestException('El aspirante no existe');

    const entity = this.becaEstRepo.create({
      beca,
      aspirante,
      periodo_academico: dto.periodo_academico,
      monto_otorgado: dto.monto_otorgado,
      fecha_asignacion: dto.fecha_asignacion
        ? new Date(dto.fecha_asignacion)
        : undefined,
      estado: dto.estado ?? 'Vigente',
    });

    return this.becaEstRepo.save(entity);
  }


  findAll() {
    return this.becaEstRepo.find({
      relations: ['beca', 'aspirante'],
    });
  }


  async findOne(id: string) {
    const row = await this.becaEstRepo.findOne({
      where: { id_beca_estudiante: id },
      relations: ['beca', 'aspirante'],
    });

    if (!row)
      throw new NotFoundException('Asignación de beca no encontrada');

    return row;
  }


  async update(id: string, dto: UpdateBecaEstudianteDto) {
    const row = await this.findOne(id);

    if (dto.id_beca) {
      const beca = await this.becaRepo.findOneBy({ id_beca: dto.id_beca });
      if (!beca) throw new BadRequestException('La beca no existe');
      row.beca = beca;
    }

    if (dto.id_aspirante) {
      const aspirante = await this.aspiranteRepo.findOneBy({
        id_aspirante: dto.id_aspirante,
      });
      if (!aspirante)
        throw new BadRequestException('El aspirante no existe');
      row.aspirante = aspirante;
    }

    if (dto.periodo_academico)
      row.periodo_academico = dto.periodo_academico;

    if (dto.monto_otorgado)
      row.monto_otorgado = dto.monto_otorgado;

    if (dto.estado) row.estado = dto.estado;

    if (dto.fecha_asignacion)
      row.fecha_asignacion = new Date(dto.fecha_asignacion);

    return this.becaEstRepo.save(row);
  }

  
  async remove(id: string) {
    const row = await this.findOne(id);
    await this.becaEstRepo.remove(row);
    return { deleted: true };
  }
}
