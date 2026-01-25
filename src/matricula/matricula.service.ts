import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Matricula } from './entities/matricula.entity';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';

@Injectable()
export class MatriculaService {
  constructor(
    @InjectRepository(Matricula)
    private readonly matriculaRepository: Repository<Matricula>,
  ) {}

  async create(createMatriculaDto: CreateMatriculaDto): Promise<Matricula | null> {
    try {
      const { id_cliente, id_carrera, ...resto } = createMatriculaDto;

      const matricula = this.matriculaRepository.create({
        ...resto,
        cliente: { id_cliente } as any,
        carrera: { id_carrera } as any,
      });

      const saved = await this.matriculaRepository.save(matricula);


      return await this.matriculaRepository.findOne({
        where: { id_matricula: saved.id_matricula },
        relations: ['cliente', 'carrera'],
      });
    } catch (error) {
      return null;
    }
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Matricula>> {
    const queryBuilder = this.matriculaRepository.createQueryBuilder('matricula');

    queryBuilder
      .leftJoinAndSelect('matricula.cliente', 'cliente')
      .leftJoinAndSelect('matricula.carrera', 'carrera')
      .orderBy('matricula.fecha_matricula', 'DESC');

    return paginate<Matricula>(queryBuilder, options);
  }

  async findOne(id_matricula: string): Promise<Matricula | null> {
    try {
      return await this.matriculaRepository.findOne({
        where: { id_matricula },
        relations: ['cliente', 'carrera'],
      });
    } catch (error) {
      return null;
    }
  }

  async update(
    id_matricula: string,
    updateMatriculaDto: UpdateMatriculaDto,
  ): Promise<Matricula | null> {
    try {
      const matricula = await this.matriculaRepository.findOne({
        where: { id_matricula },
        relations: ['cliente', 'carrera'],
      });

      if (!matricula) return null;


      if ((updateMatriculaDto as any).id_cliente) {
        (matricula as any).cliente = {
          id_cliente: (updateMatriculaDto as any).id_cliente,
        } as any;
        delete (updateMatriculaDto as any).id_cliente;
      }

      if ((updateMatriculaDto as any).id_carrera) {
        (matricula as any).carrera = {
          id_carrera: (updateMatriculaDto as any).id_carrera,
        } as any;
        delete (updateMatriculaDto as any).id_carrera;
      }

      Object.assign(matricula, updateMatriculaDto);

      const saved = await this.matriculaRepository.save(matricula);


      return await this.matriculaRepository.findOne({
        where: { id_matricula: saved.id_matricula },
        relations: ['cliente', 'carrera'],
      });
    } catch (error) {
      return null;
    }
  }

  async remove(id_matricula: string): Promise<Matricula | null> {
    try {
      const matricula = await this.matriculaRepository.findOne({
        where: { id_matricula },
        relations: ['cliente', 'carrera'],
      });

      if (!matricula) return null;

      return await this.matriculaRepository.remove(matricula);
    } catch (error) {
      return null;
    }
  }
}
