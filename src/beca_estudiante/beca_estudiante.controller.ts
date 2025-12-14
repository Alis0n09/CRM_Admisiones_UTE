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

import { BecaEstudianteService } from './beca_estudiante.service';
import { CreateBecaEstudianteDto } from './dto/create-beca_estudiante.dto';
import { UpdateBecaEstudianteDto } from './dto/update-beca_estudiante.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { BecaEstudiante } from './entities/beca_estudiante.entity';

@Controller('beca-estudiante')
export class BecaEstudianteController {
  constructor(private readonly becaEstudianteService: BecaEstudianteService) {}

  @Post()
  async create(@Body() dto: CreateBecaEstudianteDto) {
    const beca = await this.becaEstudianteService.create(dto);
    if (!beca)
      throw new InternalServerErrorException('No se pudo crear la beca');
    return new SuccessResponseDto('Beca creada con éxito', beca);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<BecaEstudiante>>> {
    if (query.limit && query.limit > 100) query.limit = 100;

    const result = await this.becaEstudianteService.findAll(query);
    return new SuccessResponseDto('Becas obtenidas con éxito', result);
  }

  @Get(':id_beca_estudiante')
  async findOne(@Param('id_beca_estudiante') id: string) {
    const beca = await this.becaEstudianteService.findOne(id);
    if (!beca) throw new NotFoundException('Beca no encontrada');
    return new SuccessResponseDto('Beca obtenida con éxito', beca);
  }

  @Put(':id_beca_estudiante')
  async update(
    @Param('id_beca_estudiante') id: string,
    @Body() dto: UpdateBecaEstudianteDto,
  ) {
    const beca = await this.becaEstudianteService.update(id, dto);
    if (!beca) throw new NotFoundException('Beca no encontrada');
    return new SuccessResponseDto('Beca actualizada con éxito', beca);
  }

  @Delete(':id_beca_estudiante')
  async remove(@Param('id_beca_estudiante') id: string) {
    const beca = await this.becaEstudianteService.remove(id);
    if (!beca) throw new NotFoundException('Beca no encontrada');
    return new SuccessResponseDto('Beca eliminada con éxito', beca);
  }
}
