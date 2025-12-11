import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Contacto } from './entities/contacto.entity';
import { QueryDto } from 'src/common/dto/query.dto';
import { CreateContactoDto } from './dto/create-contacto.dto';
import { UpdateContactoDto } from './dto/update-contacto.dto';

@Injectable()
export class ContactoService {
  constructor(
    @InjectRepository(Contacto)
    private readonly contactoRepository: Repository<Contacto>,
  ) {}

  // Crear contacto
  async create(createContactoDto: CreateContactoDto): Promise<Contacto | null> {
    try {
      const contacto = this.contactoRepository.create(createContactoDto);
      return await this.contactoRepository.save(contacto);
    } catch (error) {
      console.error('Error al crear el contacto', error);
      return null;
    }
  }

  // Listar contactos con paginación
  async findAll(options: IPaginationOptions): Promise<Pagination<Contacto>> {
    const queryBuilder = this.contactoRepository.createQueryBuilder('contacto');
    queryBuilder.orderBy('contacto.nombres', 'ASC');
    return paginate<Contacto>(queryBuilder, options);
  }

  // Buscar un contacto por ID
  async findOne(id_contacto: string): Promise<Contacto | null> {
    try {
      return await this.contactoRepository.findOne({ where: { id_contacto } });
    } catch (error) {
      console.error('Error al buscar el contacto', error);
      return null;
    }
  }

  // Actualizar un contacto
  async update(
    id_contacto: string,
    updateContactoDto: UpdateContactoDto,
  ): Promise<Contacto | null> {
    try {
      const contacto = await this.contactoRepository.findOne({ where: { id_contacto } });
      if (!contacto) return null;
      Object.assign(contacto, updateContactoDto);
      return await this.contactoRepository.save(contacto);
    } catch (error) {
      console.error('Error al actualizar el contacto', error);
      return null;
    }
  }

  // Eliminar un contacto
  async remove(id_contacto: string): Promise<Contacto | null> {
    try {
      const contacto = await this.contactoRepository.findOne({ where: { id_contacto } });
      if (!contacto) return null;
      return await this.contactoRepository.remove(contacto);
    } catch (error) {
      console.error('Error al eliminar el contacto', error);
      return null;
    }
  }
}