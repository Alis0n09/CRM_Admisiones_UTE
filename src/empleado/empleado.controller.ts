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
import { EmpleadoService } from './empleado.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';

import { QueryDto } from 'src/common/dto/query.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { Empleado } from './entities/empleado.entity';

@Controller('empleado')
export class EmpleadoController {
  constructor(private readonly empleadoService: EmpleadoService) {}

  @Post()
  async create(@Body() dto: CreateEmpleadoDto) {
    const empleado = await this.empleadoService.create(dto);
    return new SuccessResponseDto('Empleado creado con éxito', empleado);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Empleado>>> {
    if (query.limit && query.limit > 100) query.limit = 100;

    const result = await this.empleadoService.findAll(query);

    if (!result)
      throw new InternalServerErrorException(
        'No se pudieron obtener los empleados',
      );

    return new SuccessResponseDto('Empleados obtenidos con éxito', result);
  }

  @Get(':id_empleado')
  async findOne(@Param('id_empleado') id_empleado: string) {
    const empleado = await this.empleadoService.findOne(id_empleado);

    if (!empleado) throw new NotFoundException('Empleado no encontrado');

    return new SuccessResponseDto(
      'Empleado obtenido con éxito',
      empleado,
    );
  }

  @Put(':id_empleado')
  async update(
    @Param('id_empleado') id_empleado: string,
    @Body() dto: UpdateEmpleadoDto,
  ) {
    const empleado = await this.empleadoService.update(id_empleado, dto);

    if (!empleado) throw new NotFoundException('Empleado no registrado');

    return new SuccessResponseDto(
      'Empleado actualizado con éxito',
      empleado,
    );
  }

  @Delete(':id_empleado')
  async remove(@Param('id_empleado') id_empleado: string) {
    const empleado = await this.empleadoService.remove(id_empleado);

    if (!empleado) throw new NotFoundException('Empleado no encontrado');

    return new SuccessResponseDto(
      'Empleado eliminado con éxito',
      empleado,
    );
  }
}
