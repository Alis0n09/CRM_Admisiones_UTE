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
import { AspiranteService } from './aspirante.service';
import { CreateAspiranteDto } from './dto/create-aspirante.dto';
import { UpdateAspiranteDto } from './dto/update-aspirante.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { Aspirante } from './entities/aspirante.entity';

@Controller('aspirante')
export class AspiranteController {
  constructor(private readonly aspiranteService: AspiranteService) {}

  @Post()
  async create(@Body() dto: CreateAspiranteDto) {
    const aspirante = await this.aspiranteService.create(dto);
    return new SuccessResponseDto('Aspirante creado con éxito', aspirante);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Aspirante>>> {
    if (query.limit && query.limit > 100) {
      query.limit = 100;
    }

    const result = await this.aspiranteService.findAll(query);

    if (!result)
      throw new InternalServerErrorException('No se pudieron obtener los aspirantes');

    return new SuccessResponseDto('Aspirantes obtenidos con éxito', result);
  }

  @Get(':id_aspirante')
  async findOne(@Param('id_aspirante') id_aspirante: string) {
    const aspirante = await this.aspiranteService.findOne(id_aspirante);
    if (!aspirante) throw new NotFoundException('Aspirante no encontrado');
    return new SuccessResponseDto('Aspirante obtenido con éxito', aspirante);
  }

  @Put(':id_aspirante')
  async update(
    @Param('id_aspirante') id_aspirante: string,
    @Body() dto: UpdateAspiranteDto,
  ) {
    const aspirante = await this.aspiranteService.update(id_aspirante, dto);
    if (!aspirante) throw new NotFoundException('Aspirante no registrado');
    return new SuccessResponseDto('Aspirante actualizado con éxito', aspirante);
  }

  @Delete(':id_aspirante')
  async remove(@Param('id_aspirante') id_aspirante: string) {
    const aspirante = await this.aspiranteService.remove(id_aspirante);
    if (!aspirante) throw new NotFoundException('Aspirante no encontrado');
    return new SuccessResponseDto('Aspirante eliminado con éxito', aspirante);
  }
}
