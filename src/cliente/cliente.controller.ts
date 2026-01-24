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
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';

import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Public } from 'src/auth/public.decorator';

@Controller('cliente')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  
  @Post()
  @Public() 
  async create(@Body() dto: CreateClienteDto) {
    const cliente = await this.clienteService.create(dto);
    return new SuccessResponseDto('Cliente creado con éxito', cliente);
  }

 
@Get()
@Roles('ADMIN', 'ASESOR')
async findAll(
  @Query() query: QueryDto,
): Promise<SuccessResponseDto<Pagination<Cliente>>> {
  if (query.limit && query.limit > 100) query.limit = 100;

  
  const options: IPaginationOptions & { search?: string } = {
    page: query.page || 1,
    limit: query.limit || 10,
  };

  
  if (query.search) {
    options.search = query.search;
  }

  const result = await this.clienteService.findAll(options);

  if (!result)
    throw new InternalServerErrorException('No se pudieron obtener los clientes');

  return new SuccessResponseDto('Clientes obtenidos con éxito', result);
}

  
  @Get(':id_cliente')
  @Roles('ADMIN', 'ASESOR', 'ASPIRANTE')
  async findOne(@Param('id_cliente') id_cliente: string, @Req() req: any) {
    const roles: string[] = req.user?.roles ?? [];
    const isAspirante = roles.includes('ASPIRANTE');

    if (isAspirante) {
      const myClienteId = req.user?.id_cliente;
      if (!myClienteId) {
        throw new ForbiddenException(
          'Tu usuario no tiene cliente asociado',
        );
      }
      if (id_cliente !== myClienteId) {
        throw new ForbiddenException('Solo puedes ver tu perfil');
      }
    }

    const cliente = await this.clienteService.findOne(id_cliente);
    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }

    return new SuccessResponseDto('Cliente obtenido con éxito', cliente);
  }


  @Put(':id_cliente')
  @Roles('ADMIN', 'ASESOR', 'ASPIRANTE')
  async update(
    @Param('id_cliente') id_cliente: string,
    @Body() dto: UpdateClienteDto,
    @Req() req: any,
  ) {
    const roles: string[] = req.user?.roles ?? [];
    const isAspirante = roles.includes('ASPIRANTE');

    if (isAspirante) {
      const myClienteId = req.user?.id_cliente;
      if (!myClienteId) {
        throw new ForbiddenException(
          'Tu usuario no tiene cliente asociado',
        );
      }
      if (id_cliente !== myClienteId) {
        throw new ForbiddenException('Solo puedes editar tu perfil');
      }
    }

    const cliente = await this.clienteService.update(id_cliente, dto);
    if (!cliente) {
      throw new NotFoundException('Cliente no registrado');
    }

    return new SuccessResponseDto(
      'Cliente actualizado con éxito',
      cliente,
    );
  }

  
  @Delete(':id_cliente')
  @Roles('ADMIN')
  async remove(@Param('id_cliente') id_cliente: string) {
    const cliente = await this.clienteService.remove(id_cliente);
    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }

    return new SuccessResponseDto(
      'Cliente eliminado con éxito',
      cliente,
    );
  }
}
