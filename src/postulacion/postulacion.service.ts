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
      const cleanId = id_postulacion?.trim();
      if (!cleanId) {
        console.log('ID de postulación vacío en findOne');
        return null;
      }
      
      const postulacion = await this.postulacionRepository.findOne({
        where: { id_postulacion: cleanId },
        relations: ['cliente', 'carrera'],
      });
      
      if (!postulacion) {
        console.log(`Postulación no encontrada en findOne con ID: ${cleanId}`);
      }
      
      return postulacion;
    } catch (error) {
      console.error('Error en findOne:', error);
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
      // Limpiar el ID por si tiene espacios o caracteres extra
      const cleanId = id_postulacion?.trim();
      
      if (!cleanId) {
        console.log('ID de postulación vacío o inválido');
        return null;
      }

      console.log(`Buscando postulación con ID: ${cleanId}`);

      // Intentar primero con findOne
      const postulacion = await this.postulacionRepository.findOne({
        where: { id_postulacion: cleanId },
      });

      if (!postulacion) {
        console.log(`Postulación no encontrada con ID: ${cleanId}`);
        
        // Intentar también con findBy para verificar si existe alguna postulación
        const allPostulaciones = await this.postulacionRepository.find({
          take: 5,
          select: ['id_postulacion'],
        });
        console.log(`IDs de ejemplo en la BD:`, allPostulaciones.map(p => p.id_postulacion));
        
        return null;
      }

      console.log(`Postulación encontrada, eliminando: ${postulacion.id_postulacion}`);
      const removed = await this.postulacionRepository.remove(postulacion);
      console.log(`Postulación eliminada exitosamente`);
      
      return removed;
    } catch (error) {
      console.error('Error en remove:', error);
      console.error('Stack trace:', error?.stack);
      return null;
    }
  }
}
