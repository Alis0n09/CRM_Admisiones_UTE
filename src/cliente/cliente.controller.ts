import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { Cliente } from './entities/cliente.entity';

@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  async create(@Body() dto: CreateClienteDto) {
    const cliente = await this.clienteService.create(dto);
    return new SuccessResponseDto('Cliente creado con éxito', cliente);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Cliente>>> {
    if (query.limit && query.limit > 100) {
      query.limit = 100;
    }

    const result = await this.clienteService.findAll(query);

    if (!result)
      throw new InternalServerErrorException(
        'No se pudieron obtener los clientes',
      );

    return new SuccessResponseDto('Clientes obtenidos con éxito', result);
  }

  @Get(':id_cliente')
  async findOne(@Param('id_cliente') id_cliente: string) {
    const cliente = await this.clienteService.findOne(id_cliente);
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    return new SuccessResponseDto('Cliente obtenido con éxito', cliente);
  }

  @Put(':id_cliente')
  async update(
    @Param('id_cliente') id_cliente: string,
    @Body() dto: UpdateClienteDto,
  ) {
    const cliente = await this.clienteService.update(id_cliente, dto);
    if (!cliente) throw new NotFoundException('Cliente no registrado');
    return new SuccessResponseDto('Cliente actualizado con éxito', cliente);
  }

  @Delete(':id_cliente')
  async remove(@Param('id_cliente') id_cliente: string) {
    const cliente = await this.clienteService.remove(id_cliente);
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    return new SuccessResponseDto('Cliente eliminado con éxito', cliente);
  }
}
