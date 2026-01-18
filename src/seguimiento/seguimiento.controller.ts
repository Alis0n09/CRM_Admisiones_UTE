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
import { Pagination } from 'nestjs-typeorm-paginate';
import { SeguimientoService } from './seguimiento.service';
import { CreateSeguimientoDto } from './dto/create-seguimiento.dto';
import { UpdateSeguimientoDto } from './dto/update-seguimiento.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { Seguimiento } from './entities/seguimiento.entity';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('seguimiento')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SeguimientoController {
  constructor(private readonly seguimientoService: SeguimientoService) {}

  @Post()
  @Roles('ADMIN', 'ASESOR')
  async create(@Body() dto: CreateSeguimientoDto) {
    const seguimiento = await this.seguimientoService.create(dto);
    if (!seguimiento) {
      throw new InternalServerErrorException('No se pudo crear el seguimiento');
    }
    return new SuccessResponseDto('Seguimiento creado con éxito', seguimiento);
  }

  @Get()
  @Roles('ADMIN', 'ASESOR', 'ASPIRANTE')
  async findAll(
    @Query() query: QueryDto,
    @Req() req: any,
  ): Promise<SuccessResponseDto<Pagination<Seguimiento>>> {
    if (query.limit && query.limit > 100) query.limit = 100;

    const roles: string[] = req.user?.roles ?? [];
    const isAspirante = roles.includes('ASPIRANTE');

    let filtros: any = { ...query };

    if (isAspirante) {
      const myClienteId = req.user?.id_cliente;
      if (!myClienteId) {
        throw new ForbiddenException('Tu usuario no tiene cliente asociado');
      }
      filtros.id_cliente = myClienteId;
    }

    const result = await this.seguimientoService.findAll(filtros);

    if (!result)
      throw new InternalServerErrorException('No se pudieron obtener los seguimientos');

    return new SuccessResponseDto('Seguimientos obtenidos con éxito', result);
  }

  @Get(':id_seguimiento')
  @Roles('ADMIN', 'ASESOR', 'ASPIRANTE')
  async findOne(@Param('id_seguimiento') id_seguimiento: string, @Req() req: any) {
    const roles: string[] = req.user?.roles ?? [];
    const isAspirante = roles.includes('ASPIRANTE');

    const seguimiento = await this.seguimientoService.findOne(id_seguimiento);
    if (!seguimiento) throw new NotFoundException('Seguimiento no encontrado');

    if (isAspirante) {
      const myClienteId = req.user?.id_cliente;
      if (!myClienteId) {
        throw new ForbiddenException('Tu usuario no tiene cliente asociado');
      }
      if (seguimiento.cliente?.id_cliente !== myClienteId) {
        throw new ForbiddenException('Solo puedes ver los seguimientos de tu perfil');
      }
    }

    return new SuccessResponseDto('Seguimiento obtenido con éxito', seguimiento);
  }

  @Put(':id_seguimiento')
  @Roles('ADMIN', 'ASESOR', 'ASPIRANTE')
  async update(
    @Param('id_seguimiento') id_seguimiento: string,
    @Body() dto: UpdateSeguimientoDto,
    @Req() req: any,
  ) {
    const roles: string[] = req.user?.roles ?? [];
    const isAspirante = roles.includes('ASPIRANTE');

    const seguimiento = await this.seguimientoService.findOne(id_seguimiento);
    if (!seguimiento) throw new NotFoundException('Seguimiento no encontrado');

    if (isAspirante) {
      const myClienteId = req.user?.id_cliente;
      if (!myClienteId) {
        throw new ForbiddenException('Tu usuario no tiene cliente asociado');
      }
      if (seguimiento.cliente?.id_cliente !== myClienteId) {
        throw new ForbiddenException('Solo puedes editar los seguimientos de tu perfil');
      }
    }

    const updated = await this.seguimientoService.update(id_seguimiento, dto);
    if (!updated) throw new NotFoundException('Seguimiento no registrado');

    return new SuccessResponseDto('Seguimiento actualizado con éxito', updated);
  }

  @Delete(':id_seguimiento')
  @Roles('ADMIN')
  async remove(@Param('id_seguimiento') id_seguimiento: string) {
    const seguimiento = await this.seguimientoService.remove(id_seguimiento);
    if (!seguimiento) throw new NotFoundException('Seguimiento no encontrado');

    return new SuccessResponseDto('Seguimiento eliminado con éxito', seguimiento);
  }
}
