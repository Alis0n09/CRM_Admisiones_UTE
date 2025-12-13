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
import { TareaCrmService } from './tarea_crm.service';
import { CreateTareaDto } from './dto/create-tarea_crm.dto';
import { UpdateTareaDto } from './dto/update-tarea_crm.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { TareaCrm } from './entities/tarea_crm.entity';

@Controller('tareas')
export class TareaCrmController {
  constructor(private readonly tareaService: TareaCrmService) {}

  @Post()
  async create(@Body() dto: CreateTareaDto) {
    const tarea = await this.tareaService.create(dto);
    return new SuccessResponseDto('Tarea creada con éxito', tarea);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<TareaCrm>>> {
    if (query.limit && query.limit > 100) {
      query.limit = 100;
    }

    const result = await this.tareaService.findAll(query);

    if (!result)
      throw new InternalServerErrorException('No se pudieron obtener las tareas');

    return new SuccessResponseDto('Tareas obtenidas con éxito', result);
  }

  @Get(':id_tarea')
  async findOne(@Param('id_tarea') id_tarea: string) {
    const tarea = await this.tareaService.findOne(id_tarea);
    if (!tarea) throw new NotFoundException('Tarea no encontrada');
    return new SuccessResponseDto('Tarea obtenida con éxito', tarea);
  }

  @Put(':id_tarea')
  async update(
    @Param('id_tarea') id_tarea: string,
    @Body() dto: UpdateTareaDto,
  ) {
    const tarea = await this.tareaService.update(id_tarea, dto);
    if (!tarea) throw new NotFoundException('Tarea no registrada');
    return new SuccessResponseDto('Tarea actualizada con éxito', tarea);
  }

  @Delete(':id_tarea')
  async remove(@Param('id_tarea') id_tarea: string) {
    const tarea = await this.tareaService.remove(id_tarea);
    if (!tarea) throw new NotFoundException('Tarea no encontrada');
    return new SuccessResponseDto('Tarea eliminada con éxito', tarea);
  }
}