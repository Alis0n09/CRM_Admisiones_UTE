import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultadoExamen } from './entities/resultado_examen.entity';
import { CreateResultadoExamenDto } from './dto/create-resultado_examen.dto';
import { UpdateResultadoExamenDto } from './dto/update-resultado_examen.dto';
import { Postulacion } from 'src/postulacion/entities/postulacion.entity';
import { ExamenAdmision } from 'src/examen_admision/entities/examen_admision.entity';
@Injectable()
export class ResultadoExamenService {
  constructor(
    @InjectRepository(ResultadoExamen)
    private readonly repo: Repository<ResultadoExamen>,

    @InjectRepository(Postulacion)
    private readonly postRepo: Repository<Postulacion>,

    @InjectRepository(ExamenAdmision)
    private readonly examRepo: Repository<ExamenAdmision>,
  ) {}

  async create(dto: CreateResultadoExamenDto): Promise<ResultadoExamen> {
    const postulacion = await this.postRepo.findOne({
      where: { id_postulacion: dto.id_postulacion },
    });
    if (!postulacion) {
      throw new NotFoundException('Postulación no encontrada');
    }

    const examen = await this.examRepo.findOne({
      where: { id_examen: dto.id_examen },
    });
    if (!examen) {
      throw new NotFoundException('Examen no encontrado');
    }

    const resultado = this.repo.create({
      postulacion,
      examen,
      puntaje_obtenido: dto.puntaje_obtenido,
      fecha_resultado: new Date(dto.fecha_resultado),
    });

    return await this.repo.save(resultado);
  }

  async findAll(): Promise<ResultadoExamen[]> {
    return await this.repo.find();
  }

  async findOne(id: string): Promise<ResultadoExamen> {
    const resultado = await this.repo.findOne({
      where: { id_resultado: id },
    });

    if (!resultado) {
      throw new NotFoundException('Resultado de examen no encontrado');
    }

    return resultado;
  }

  async update(
    id: string,
    dto: UpdateResultadoExamenDto,
  ): Promise<ResultadoExamen> {
    const resultado = await this.findOne(id);

    if (dto.id_postulacion) {
      const postulacion = await this.postRepo.findOne({
        where: { id_postulacion: dto.id_postulacion },
      });
      if (!postulacion) {
        throw new NotFoundException('Postulación no encontrada');
      }
      resultado.postulacion = postulacion;
    }

    if (dto.id_examen) {
      const examen = await this.examRepo.findOne({
        where: { id_examen: dto.id_examen },
      });
      if (!examen) {
        throw new NotFoundException('Examen no encontrado');
      }
      resultado.examen = examen;
    }

    if (dto.puntaje_obtenido !== undefined) {
      resultado.puntaje_obtenido = dto.puntaje_obtenido;
    }

    if (dto.fecha_resultado) {
      resultado.fecha_resultado = new Date(dto.fecha_resultado);
    }

    return await this.repo.save(resultado);
  }

  async remove(id: string): Promise<void> {
    const resultado = await this.findOne(id);
    await this.repo.remove(resultado);
  }
}
