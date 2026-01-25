import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  IPaginationOptions,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Postulacion } from './entities/postulacion.entity';
import { CreatePostulacionDto } from './dto/create-postulacion.dto';
import { UpdatePostulacionDto } from './dto/update-postulacion.dto';

@Injectable()
export class PostulacionService {
  constructor(
    @InjectRepository(Postulacion)
    private readonly postulacionRepository: Repository<Postulacion>,
  ) {}

  async create(
    createPostulacionDto: CreatePostulacionDto,
  ): Promise<Postulacion | null> {
    try {
      const { id_cliente, id_carrera, ...resto } = createPostulacionDto;

      const postulacion = this.postulacionRepository.create({
        ...resto,
        cliente: { id_cliente } as any,
        carrera: { id_carrera } as any,
      });

      const saved = await this.postulacionRepository.save(postulacion);

      return await this.postulacionRepository.findOne({
        where: { id_postulacion: saved.id_postulacion },
        relations: ['cliente', 'carrera'],
      });
    } catch (error) {
      return null;
    }
  }

  async findAll(
    options: IPaginationOptions,
  ): Promise<Pagination<Postulacion>> {
    const queryBuilder =
      this.postulacionRepository.createQueryBuilder('postulacion');

    queryBuilder
      .leftJoinAndSelect('postulacion.cliente', 'cliente')
      .leftJoinAndSelect('postulacion.carrera', 'carrera')
      .orderBy('postulacion.fecha_postulacion', 'DESC');

    return paginate<Postulacion>(queryBuilder, options);
  }

  async findOne(id_postulacion: string): Promise<Postulacion | null> {
    try {
      return await this.postulacionRepository.findOne({
        where: { id_postulacion },
        relations: ['cliente', 'carrera'],
      });
    } catch (error) {
      return null;
    }
  }

  async findAllByUsuarioId(
    usuarioId: string | number,
  ): Promise<Postulacion[]> {
    try {
      return await this.postulacionRepository.find({
        where: { cliente: { id_cliente: usuarioId as any } },
        relations: ['cliente', 'carrera'],
        order: { fecha_postulacion: 'DESC' as any },
      });
    } catch (error) {
      return [];
    }
  }

  async findAllByClienteId(
    id_cliente: string | number,
    options: IPaginationOptions,
  ): Promise<Pagination<Postulacion>> {
    const queryBuilder =
      this.postulacionRepository.createQueryBuilder('postulacion');

    queryBuilder
      .leftJoinAndSelect('postulacion.cliente', 'cliente')
      .leftJoinAndSelect('postulacion.carrera', 'carrera')
      .where('cliente.id_cliente = :id_cliente', { id_cliente })
      .orderBy('postulacion.fecha_postulacion', 'DESC');

    return paginate<Postulacion>(queryBuilder, options);
  }

  async findActiveByClienteId(id_cliente: string | number): Promise<Postulacion | null> {
    try {
      const postulacion = await this.postulacionRepository.findOne({
        where: { 
          cliente: { id_cliente: id_cliente as any },
        },
        relations: ['cliente', 'carrera'],
        order: { fecha_postulacion: 'DESC' as any },
      });

      return postulacion;
    } catch (error) {
      return null;
    }
  }

  async update(
    id_postulacion: string,
    updatePostulacionDto: UpdatePostulacionDto,
  ): Promise<Postulacion | null> {
    try {
      const postulacion = await this.postulacionRepository.findOne({
        where: { id_postulacion },
      });

      if (!postulacion) return null;

      Object.assign(postulacion, updatePostulacionDto);

      return await this.postulacionRepository.save(postulacion);
    } catch (error) {
      return null;
    }
  }

  async remove(id_postulacion: string): Promise<Postulacion | null> {
    try {
      const postulacion = await this.postulacionRepository.findOne({
        where: { id_postulacion },
      });

      if (!postulacion) return null;

      return await this.postulacionRepository.remove(postulacion);
    } catch (error) {
      return null;
    }
  }
}
