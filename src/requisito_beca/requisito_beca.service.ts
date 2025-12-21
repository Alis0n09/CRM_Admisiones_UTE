import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { RequisitoBeca } from './entities/requisito_beca.entity';
import { CreateRequisitoBecaDto } from './dto/create-requisito_beca.dto';
import { UpdateRequisitoBecaDto } from './dto/update-requisito_beca.dto';

@Injectable()
export class RequisitoBecaService {
  constructor(
    @InjectRepository(RequisitoBeca)
    private readonly requisitoBecaRepository: Repository<RequisitoBeca>,
  ) {}

  async create(
    createRequisitoBecaDto: CreateRequisitoBecaDto,
  ): Promise<RequisitoBeca | null> {
    try {
      const { id_beca, ...resto } = createRequisitoBecaDto;

      const requisito = this.requisitoBecaRepository.create({
        ...resto,
        beca: { id_beca } as any,
      });

      const saved = (await this.requisitoBecaRepository.save(
        requisito,
      )) as unknown as RequisitoBeca;

      
      return await this.requisitoBecaRepository.findOne({
        where: { id_requisito: saved.id_requisito },
        relations: ['beca'],
      });
    } catch (error) {
      console.error('Error al crear el requisito de beca', error);
      return null;
    }
  }

  async findAll(
    options: IPaginationOptions,
  ): Promise<Pagination<RequisitoBeca>> {
    const queryBuilder =
      this.requisitoBecaRepository.createQueryBuilder('requisito');

    queryBuilder
      .leftJoinAndSelect('requisito.beca', 'beca')
      .orderBy('requisito.id_requisito', 'DESC');

    return paginate<RequisitoBeca>(queryBuilder, options);
  }

  async findOne(id_requisito: string): Promise<RequisitoBeca | null> {
    try {
      return await this.requisitoBecaRepository.findOne({
        where: { id_requisito },
        relations: ['beca'],
      });
    } catch (error) {
      console.error('Error al buscar el requisito de beca', error);
      return null;
    }
  }

  async update(
    id_requisito: string,
    updateRequisitoBecaDto: UpdateRequisitoBecaDto,
  ): Promise<RequisitoBeca | null> {
    try {
      const requisito = await this.requisitoBecaRepository.findOne({
        where: { id_requisito },
        relations: ['beca'],
      });

      if (!requisito) return null;

   
      if ((updateRequisitoBecaDto as any).id_beca) {
        (requisito as any).beca = {
          id_beca: (updateRequisitoBecaDto as any).id_beca,
        } as any;
        delete (updateRequisitoBecaDto as any).id_beca;
      }

      Object.assign(requisito, updateRequisitoBecaDto as any);

      const saved = (await this.requisitoBecaRepository.save(
        requisito,
      )) as unknown as RequisitoBeca;

    
      return await this.requisitoBecaRepository.findOne({
        where: { id_requisito: saved.id_requisito },
        relations: ['beca'],
      });
    } catch (error) {
      console.error('Error al actualizar el requisito de beca', error);
      return null;
    }
  }

  async remove(id_requisito: string): Promise<RequisitoBeca | null> {
    try {
      const requisito = await this.requisitoBecaRepository.findOne({
        where: { id_requisito },
        relations: ['beca'],
      });

      if (!requisito) return null;

      return await this.requisitoBecaRepository.remove(requisito);
    } catch (error) {
      console.error('Error al eliminar el requisito de beca', error);
      return null;
    }
  }
}
