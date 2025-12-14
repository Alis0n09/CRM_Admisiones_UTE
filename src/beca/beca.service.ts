import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Beca } from './entities/beca.entity';
import { CreateBecaDto } from './dto/create-beca.dto';
import { UpdateBecaDto } from './dto/update-beca.dto';

@Injectable()
export class BecaService {
  constructor(
    @InjectRepository(Beca)
    private readonly becaRepository: Repository<Beca>,
  ) {}

  async create(createBecaDto: CreateBecaDto): Promise<Beca | null> {
    try {
      // DTO tiene decimales como string (IsDecimal), por eso casteamos
      const beca = this.becaRepository.create(createBecaDto as any);

      // Forzamos el tipo para evitar que TS lo infiera como Beca[]
      const saved = (await this.becaRepository.save(beca)) as unknown as Beca;

      // devolver completo
      return await this.becaRepository.findOne({
        where: { id_beca: saved.id_beca },
      });
    } catch (error) {
      console.error('Error al crear la beca', error);
      return null;
    }
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Beca>> {
    const queryBuilder = this.becaRepository.createQueryBuilder('beca');

    queryBuilder.orderBy('beca.fecha_inicio', 'DESC');

    return paginate<Beca>(queryBuilder, options);
  }

  async findOne(id_beca: string): Promise<Beca | null> {
    try {
      return await this.becaRepository.findOne({
        where: { id_beca },
      });
    } catch (error) {
      console.error('Error al buscar la beca', error);
      return null;
    }
  }

  async update(
    id_beca: string,
    updateBecaDto: UpdateBecaDto,
  ): Promise<Beca | null> {
    try {
      const beca = await this.becaRepository.findOne({
        where: { id_beca },
      });

      if (!beca) return null;

      Object.assign(beca, updateBecaDto as any);

      const saved = (await this.becaRepository.save(beca)) as Beca;

      // devolver completo actualizado
      return await this.becaRepository.findOne({
        where: { id_beca: saved.id_beca },
      });
    } catch (error) {
      console.error('Error al actualizar la beca', error);
      return null;
    }
  }

  async remove(id_beca: string): Promise<Beca | null> {
    try {
      const beca = await this.becaRepository.findOne({
        where: { id_beca },
      });

      if (!beca) return null;

      return await this.becaRepository.remove(beca);
    } catch (error) {
      console.error('Error al eliminar la beca', error);
      return null;
    }
  }
}
