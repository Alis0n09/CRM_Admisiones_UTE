import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  IPaginationOptions,
  Pagination,
} from 'nestjs-typeorm-paginate';

import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    try {
      const exists = await this.clienteRepository.findOne({
        where: { numero_identificacion: createClienteDto.numero_identificacion },
      });

      if (exists) {
        throw new BadRequestException(
          'Ya existe un cliente con esa cédula o identificación',
        );
      }

      const cliente = this.clienteRepository.create(createClienteDto);
      return await this.clienteRepository.save(cliente);
    } catch (error: any) {
      if (error?.code === '23505') {
        if (error?.detail?.includes('numero_identificacion')) {
          throw new BadRequestException(
            'Ya existe un cliente con esa cédula o identificación',
          );
        }
        throw new BadRequestException('Ya existe un registro con datos duplicados');
      }
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Error interno al crear el cliente');
    }
  }

async findAll(options: IPaginationOptions & { search?: string }): Promise<Pagination<Cliente>> {
  const queryBuilder = this.clienteRepository.createQueryBuilder('cliente');
  if (options.search && options.search.trim()) {
    const searchTerm = `%${options.search.trim()}%`;
    queryBuilder.where(
      '(cliente.nombres ILIKE :search OR cliente.apellidos ILIKE :search OR cliente.numero_identificacion ILIKE :search OR cliente.correo ILIKE :search)',
      { search: searchTerm }
    );
  }
  
  queryBuilder.orderBy('cliente.nombres', 'ASC');
  return paginate<Cliente>(queryBuilder, options);
}

  async findOne(id_cliente: string): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { id_cliente },
    });

    if (!cliente) throw new NotFoundException('Cliente no encontrado');

    return cliente;
  }

  async update(id_cliente: string, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    try {
      const cliente = await this.clienteRepository.findOne({
        where: { id_cliente },
      });
      if (!cliente) throw new NotFoundException('Cliente no encontrado');
      if (
        updateClienteDto.numero_identificacion &&
        updateClienteDto.numero_identificacion !== cliente.numero_identificacion
      ) {
        const exists = await this.clienteRepository.findOne({
          where: { numero_identificacion: updateClienteDto.numero_identificacion },
        });

        if (exists && exists.id_cliente !== id_cliente) {
          throw new BadRequestException(
            'Ya existe un cliente con esa cédula o identificación',
          );
        }
      }

      Object.assign(cliente, updateClienteDto);
      return await this.clienteRepository.save(cliente);
    } catch (error: any) {
      if (error?.code === '23505') {
        if (error?.detail?.includes('numero_identificacion')) {
          throw new BadRequestException(
            'Ya existe un cliente con esa cédula o identificación',
          );
        }
        throw new BadRequestException('Ya existe un registro con datos duplicados');
      }

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Error interno al actualizar el cliente');
    }
  }

  async remove(id_cliente: string): Promise<Cliente> {
    try {
      const cliente = await this.clienteRepository.findOne({
        where: { id_cliente },
      });
      if (!cliente) throw new NotFoundException('Cliente no encontrado');

      return await this.clienteRepository.remove(cliente);
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Error interno al eliminar el cliente');
    }
  }
}
