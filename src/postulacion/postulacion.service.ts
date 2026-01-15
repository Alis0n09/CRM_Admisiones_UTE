import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Postulacion } from './entities/postulacion.entity';
import { QueryDto } from 'src/common/dto/query.dto';
import { CreatePostulacionDto } from './dto/create-postulacion.dto';
import { UpdatePostulacionDto } from './dto/update-postulacion.dto';

@Injectable()
export class PostulacionService {
  constructor(
    @InjectRepository(Postulacion)
    private readonly postulacionRepository: Repository<Postulacion>,
  ) {}

 
async create(createPostulacionDto: CreatePostulacionDto): Promise<Postulacion | null> {
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
    console.error('Error al crear la postulacion', error);
    return null;
  }
}


async findAll(options: IPaginationOptions): Promise<Pagination<Postulacion>> {
  const queryBuilder = this.postulacionRepository.createQueryBuilder('postulacion');

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
    console.error('Error al buscar la postulacion', error);
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
      console.error('Error al actualizar la postulacion', error);
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
      console.error('Error al eliminar la postulacion', error);
      return null;
    }
  }
}
