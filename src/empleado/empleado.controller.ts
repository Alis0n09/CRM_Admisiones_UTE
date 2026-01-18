import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  NotFoundException,
  InternalServerErrorException,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';

import { Pagination } from 'nestjs-typeorm-paginate';
import { EmpleadoService } from './empleado.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';

import { QueryDto } from 'src/common/dto/query.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { Empleado } from './entities/empleado.entity';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('empleado')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmpleadoController {
  constructor(private readonly empleadoService: EmpleadoService) {}


  @Post()
  @Roles('ADMIN')
  async create(@Body() dto: CreateEmpleadoDto) {
    const empleado = await this.empleadoService.create(dto);
    return new SuccessResponseDto('Empleado creado con éxito', empleado);
  }

  @Get()
  @Roles('ADMIN')
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Empleado>>> {
    if (query.limit && query.limit > 100) query.limit = 100;

    const result = await this.empleadoService.findAll(query);

    if (!result) {
      throw new InternalServerErrorException('No se pudieron obtener los empleados');
    }

    return new SuccessResponseDto('Empleados obtenidos con éxito', result);
  }

  @Get(':id_empleado')
  @Roles('ADMIN', 'ASESOR')
  async findOne(@Param('id_empleado') id_empleado: string, @Req() req: any) {
    const roles: string[] = Array.isArray(req.user?.roles)
      ? req.user.roles
      : req.user?.role
      ? [req.user.role]
      : [];

    const isAsesor = roles.includes('ASESOR');

    if (isAsesor) {

      const myEmpleadoId = req.user?.id_empleado;

      if (!myEmpleadoId) {
        throw new ForbiddenException('Tu usuario no tiene empleado asociado');
      }
      if (id_empleado !== myEmpleadoId) {
        throw new ForbiddenException('Solo puedes ver tu información');
      }
    }

    const empleado = await this.empleadoService.findOne(id_empleado);

    if (!empleado) {
      throw new NotFoundException('Empleado no encontrado');
    }

    return new SuccessResponseDto('Empleado obtenido con éxito', empleado);
  }


  @Put(':id_empleado')
  @Roles('ADMIN', 'ASESOR')
  async update(
    @Param('id_empleado') id_empleado: string,
    @Body() dto: UpdateEmpleadoDto,
    @Req() req: any,
  ) {
    const roles: string[] = Array.isArray(req.user?.roles)
      ? req.user.roles
      : req.user?.role
      ? [req.user.role]
      : [];

    const isAsesor = roles.includes('ASESOR');

    if (isAsesor) {

      const myEmpleadoId = req.user?.id_empleado;

      if (!myEmpleadoId) {
        throw new ForbiddenException('Tu usuario no tiene empleado asociado');
      }
      if (id_empleado !== myEmpleadoId) {
        throw new ForbiddenException('Solo puedes actualizar tu información');
      }
    }

    const empleado = await this.empleadoService.update(id_empleado, dto);

    if (!empleado) {
      throw new NotFoundException('Empleado no registrado');
    }

    return new SuccessResponseDto('Empleado actualizado con éxito', empleado);
  }

  @Patch(':id_empleado')
  @Roles('ADMIN', 'ASESOR')
  async patch(
    @Param('id_empleado') id_empleado: string,
    @Body() dto: UpdateEmpleadoDto,
    @Req() req: any,
  ) {
    const roles: string[] = Array.isArray(req.user?.roles)
      ? req.user.roles
      : req.user?.role
      ? [req.user.role]
      : [];

    const isAsesor = roles.includes('ASESOR');

    if (isAsesor) {
      const myEmpleadoId = req.user?.id_empleado;

      if (!myEmpleadoId) {
        throw new ForbiddenException('Tu usuario no tiene empleado asociado');
      }
      if (id_empleado !== myEmpleadoId) {
        throw new ForbiddenException('Solo puedes actualizar tu información');
      }
    }

    const empleado = await this.empleadoService.update(id_empleado, dto);

    if (!empleado) {
      throw new NotFoundException('Empleado no registrado');
    }

    return new SuccessResponseDto(
      'Empleado actualizado parcialmente con éxito',
      empleado,
    );
  }

  @Delete(':id_empleado')
  @Roles('ADMIN')
  async remove(@Param('id_empleado') id_empleado: string) {
    const empleado = await this.empleadoService.remove(id_empleado);

    if (!empleado) {
      throw new NotFoundException('Empleado no encontrado');
    }

    return new SuccessResponseDto('Empleado eliminado con éxito', empleado);
  }
}
