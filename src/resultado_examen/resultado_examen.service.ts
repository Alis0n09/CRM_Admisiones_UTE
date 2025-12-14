import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultadoExamen } from './entities/resultado_examen.entity';
import { CreateResultadoExamenDto } from './dto/create-resultado_examen.dto';
import { UpdateResultadoExamenDto } from './dto/update-resultado_examen.dto';

@Injectable()
export class ResultadoExamenService {
  constructor(
    @InjectRepository(ResultadoExamen)
    private readonly repo: Repository<ResultadoExamen>,
  ) {}

  async create(dto: CreateResultadoExamenDto): Promise<ResultadoExamen> {
    const resultado = this.repo.create({
      // ✅ clave: usar 'id' (PK típica del entity relacionado)
      postulacion: { id: dto.id_postulacion } as any,
      examen: { id: dto.id_examen } as any,
      puntaje_obtenido: dto.puntaje_obtenido,
      fecha_resultado: dto.fecha_resultado,
    });

    return await this.repo.save(resultado);
  }

  async findAll(): Promise<ResultadoExamen[]> {
    return await this.repo.find({
      relations: ['postulacion', 'examen'],
    });
  }

  async findOne(id: string): Promise<ResultadoExamen> {
    const resultado = await this.repo.findOne({
      where: { id_resultado: id },
      relations: ['postulacion', 'examen'],
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


    resultado.postulacion = { id: dto.id_postulacion } as any;
    resultado.examen = { id: dto.id_examen } as any;

    resultado.puntaje_obtenido = dto.puntaje_obtenido;
    resultado.fecha_resultado = dto.fecha_resultado;

    return await this.repo.save(resultado);
  }

  async remove(id: string): Promise<void> {
    const resultado = await this.findOne(id);
    await this.repo.remove(resultado);
  }
}
