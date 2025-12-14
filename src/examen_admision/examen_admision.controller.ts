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
import { ExamenAdmisionService } from './examen_admision.service';
import { CreateExamenAdmisionDto } from './dto/create-examen_admision.dto';
import { UpdateExamenAdmisionDto } from './dto/update-examen_admision.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { ExamenAdmision } from './entities/examen_admision.entity';

@Controller('examenes-admision')
export class ExamenAdmisionController {
  constructor(private readonly service: ExamenAdmisionService) {}

  @Post()
  async create(@Body() dto: CreateExamenAdmisionDto) {
    const examen = await this.service.create(dto);

    if (!examen) {
      throw new InternalServerErrorException('No se pudo crear el examen');
    }

    return new SuccessResponseDto('Examen creado con éxito', examen);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<ExamenAdmision>>> {
    if (query.limit && query.limit > 100) {
      query.limit = 100;
    }

    const result = await this.service.findAll(query);
    

    if (!result) {
      throw new InternalServerErrorException(
        'No se pudieron obtener los exámenes',
      );
    }

    return new SuccessResponseDto('Exámenes obtenidos con éxito', result);
  }

  @Get(':id_examen')
  async findOne(@Param('id_examen') id_examen: string) {
    const examen = await this.service.findOne(id_examen);

    if (!examen) {
      throw new NotFoundException('Examen no encontrado');
    }

    return new SuccessResponseDto('Examen obtenido con éxito', examen);
  }

  @Put(':id_examen')
  async update(
    @Param('id_examen') id_examen: string,
    @Body() dto: UpdateExamenAdmisionDto,
  ) {
    const examen = await this.service.update(id_examen, dto);

    if (!examen) {
      throw new NotFoundException('Examen no registrado');
    }

    return new SuccessResponseDto('Examen actualizado con éxito', examen);
  }

  @Delete(':id_examen')
  async remove(@Param('id_examen') id_examen: string) {
    const examen = await this.service.remove(id_examen);

    if (!examen) {
      throw new NotFoundException('Examen no encontrado');
    }

    return new SuccessResponseDto('Examen eliminado con éxito', examen);
  }
}
