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
import { AsesorService } from './asesor.service';
import { CreateAsesorDto } from './dto/create-asesor.dto';
import { UpdateAsesorDto } from './dto/update-asesor.dto';

import { QueryDto } from 'src/common/dto/query.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { Asesor } from './entities/asesor.entity';

@Controller('asesor')
export class AsesorController {
  constructor(private readonly asesorService: AsesorService) {}

  
  @Post()
  async create(@Body() dto: CreateAsesorDto) {
    const asesor = await this.asesorService.create(dto);
    return new SuccessResponseDto('Asesor creado con éxito', asesor);
  }


  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Asesor>>> {
    if (query.limit && query.limit > 100) query.limit = 100;

    const result = await this.asesorService.findAll(query);

    if (!result)
      throw new InternalServerErrorException('No se pudieron obtener los asesores');

    return new SuccessResponseDto('Asesores obtenidos con éxito', result);
  }

 
  @Get(':id_asesor')
  async findOne(@Param('id_asesor') id_asesor: string) {
    const asesor = await this.asesorService.findOne(id_asesor);

    if (!asesor) throw new NotFoundException('Asesor no encontrado');

    return new SuccessResponseDto('Asesor obtenido con éxito', asesor);
  }


  @Put(':id_asesor')
  async update(
    @Param('id_asesor') id_asesor: string,
    @Body() dto: UpdateAsesorDto,
  ) {
    const asesor = await this.asesorService.update(id_asesor, dto);

    if (!asesor) throw new NotFoundException('Asesor no registrado');

    return new SuccessResponseDto('Asesor actualizado con éxito', asesor);
  }

  
  @Delete(':id_asesor')
  async remove(@Param('id_asesor') id_asesor: string) {
    const asesor = await this.asesorService.remove(id_asesor);

    if (!asesor) throw new NotFoundException('Asesor no encontrado');

    return new SuccessResponseDto('Asesor eliminado con éxito', asesor);
  }
}
