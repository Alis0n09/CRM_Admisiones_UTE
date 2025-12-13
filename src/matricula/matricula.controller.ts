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
import { MatriculaService } from './matricula.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { Matricula } from './entities/matricula.entity';

@Controller('matricula')
export class MatriculaController {
  constructor(private readonly matriculaService: MatriculaService) {}

  @Post()
  async create(@Body() dto: CreateMatriculaDto) {
    const matricula = await this.matriculaService.create(dto);

    if (!matricula)
      throw new InternalServerErrorException('No se pudo crear la matrícula');

    return new SuccessResponseDto('Matrícula creada con éxito', matricula);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Matricula>>> {
    const result = await this.matriculaService.findAll(query);
    return new SuccessResponseDto('Matrículas obtenidas con éxito', result);
  }

  @Get(':id_matricula')
  async findOne(@Param('id_matricula') id_matricula: string) {
    const matricula = await this.matriculaService.findOne(id_matricula);

    if (!matricula) throw new NotFoundException('Matrícula no encontrada');

    return new SuccessResponseDto('Matrícula obtenida con éxito', matricula);
  }

  @Put(':id_matricula')
  async update(
    @Param('id_matricula') id_matricula: string,
    @Body() dto: UpdateMatriculaDto,
  ) {
    const matricula = await this.matriculaService.update(id_matricula, dto);

    if (!matricula) throw new NotFoundException('Matrícula no encontrada');

    return new SuccessResponseDto('Matrícula actualizada con éxito', matricula);
  }

  @Delete(':id_matricula')
  async remove(@Param('id_matricula') id_matricula: string) {
    const matricula = await this.matriculaService.remove(id_matricula);

    if (!matricula) throw new NotFoundException('Matrícula no encontrada');

    return new SuccessResponseDto('Matrícula eliminada con éxito', matricula);
  }
}
