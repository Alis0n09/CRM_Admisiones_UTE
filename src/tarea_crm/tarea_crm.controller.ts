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
import { TareaCrmService } from './tarea_crm.service';
import { CreateTareaDto } from './dto/create-tarea_crm.dto';
import { UpdateTareaDto } from './dto/update-tarea_crm.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { TareaCrm } from './entities/tarea_crm.entity';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('tareas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TareaCrmController {
  constructor(private readonly tareaService: TareaCrmService) {}

  @Post()
  @Roles('ADMIN', 'ASESOR')
  async create(@Body() dto: CreateTareaDto, @Req() req: any) {
    const roles: string[] = req.user?.roles ?? [];

    if (roles.includes('ASESOR')) {
      if (!req.user?.id_empleado) {
        throw new ForbiddenException('Tu usuario no tiene empleado asociado');
      }
      dto.id_empleado = req.user.id_empleado;
    }

    const tarea = await this.tareaService.create(dto);
    return new SuccessResponseDto('Tarea creada con éxito', tarea);
  }

  @Get()
  @Roles('ADMIN', 'ASESOR', 'ASPIRANTE')
  async findAll(
    @Query() query: QueryDto,
    @Req() req: any,
  ): Promise<SuccessResponseDto<Pagination<TareaCrm>>> {
    if (query.limit && query.limit > 100) query.limit = 100;

    const roles: string[] = req.user?.roles ?? [];
    let filtros: any = { ...query };

    if (roles.includes('ASESOR')) {
      if (!req.user?.id_empleado) {
        throw new ForbiddenException('Tu usuario no tiene empleado asociado');
      }
      filtros.id_empleado = req.user.id_empleado;
    }

    if (roles.includes('ASPIRANTE')) {
      const myClienteId = req.user?.id_cliente;
      if (!myClienteId) {
        throw new ForbiddenException('Tu usuario no tiene cliente asociado');
      }
      filtros.id_cliente = myClienteId;
    }

    const result = await this.tareaService.findAll(filtros);

    if (!result) {
      throw new InternalServerErrorException('No se pudieron obtener las tareas');
    }

    return new SuccessResponseDto('Tareas obtenidas con éxito', result);
  }

  @Get(':id_tarea')
  @Roles('ADMIN', 'ASESOR', 'ASPIRANTE')
  async findOne(@Param('id_tarea') id_tarea: string, @Req() req: any) {
    const roles: string[] = req.user?.roles ?? [];
    const isAspirante = roles.includes('ASPIRANTE');
    const isAsesor = roles.includes('ASESOR');

    const tarea = await this.tareaService.findOne(id_tarea);
    if (!tarea) throw new NotFoundException('Tarea no encontrada');

    if (isAsesor) {
      const myEmpleadoId = req.user?.id_empleado;
      if (!myEmpleadoId) {
        throw new ForbiddenException('Tu usuario no tiene empleado asociado');
      }
      if (tarea.empleado?.id_empleado !== myEmpleadoId) {
        throw new ForbiddenException('Solo puedes ver tus propias tareas');
      }
    }

    if (isAspirante) {
      const myClienteId = req.user?.id_cliente;
      if (!myClienteId) {
        throw new ForbiddenException('Tu usuario no tiene cliente asociado');
      }
      if (tarea.cliente?.id_cliente !== myClienteId) {
        throw new ForbiddenException('Solo puedes ver las tareas de tu perfil');
      }
    }

    return new SuccessResponseDto('Tarea obtenida con éxito', tarea);
  }

  @Put(':id_tarea')
  @Roles('ADMIN', 'ASESOR', 'ASPIRANTE')
  async update(
    @Param('id_tarea') id_tarea: string,
    @Body() dto: UpdateTareaDto,
    @Req() req: any,
  ) {
    const roles: string[] = req.user?.roles ?? [];
    const isAspirante = roles.includes('ASPIRANTE');
    const isAsesor = roles.includes('ASESOR');

    const tarea = await this.tareaService.findOne(id_tarea);
    if (!tarea) throw new NotFoundException('Tarea no encontrada');

    if (isAsesor) {
      const myEmpleadoId = req.user?.id_empleado;
      if (!myEmpleadoId) {
        throw new ForbiddenException('Tu usuario no tiene empleado asociado');
      }
      if (tarea.empleado?.id_empleado !== myEmpleadoId) {
        throw new ForbiddenException('Solo puedes actualizar tus propias tareas');
      }

      const { id_empleado, id_cliente, ...allowedFields } = dto;
      dto = allowedFields as UpdateTareaDto;
    }

    if (isAspirante) {
      const myClienteId = req.user?.id_cliente;
      if (!myClienteId) {
        throw new ForbiddenException('Tu usuario no tiene cliente asociado');
      }
      if (tarea.cliente?.id_cliente !== myClienteId) {
        throw new ForbiddenException('Solo puedes editar las tareas de tu perfil');
      }
    }

    const updated = await this.tareaService.update(id_tarea, dto);
    return new SuccessResponseDto('Tarea actualizada con éxito', updated);
  }

  @Delete(':id_tarea')
  @Roles('ADMIN')
  async remove(@Param('id_tarea') id_tarea: string) {
    const tarea = await this.tareaService.remove(id_tarea);
    if (!tarea) throw new NotFoundException('Tarea no encontrada');

    return new SuccessResponseDto('Tarea eliminada con éxito', tarea);
  }
}
