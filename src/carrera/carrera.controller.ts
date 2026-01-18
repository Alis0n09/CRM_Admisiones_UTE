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
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CarreraService } from './carrera.service';
import { CreateCarreraDto } from './dto/create-carrera.dto';
import { UpdateCarreraDto } from './dto/update-carrera.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { Carrera } from './entities/carrera.entity';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('carrera')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CarreraController {
  constructor(private readonly carreraService: CarreraService) {}


  @Post()
  @Roles('ADMIN')
  async create(@Body() dto: CreateCarreraDto) {
    const carrera = await this.carreraService.create(dto);
    if (!carrera) {
      throw new InternalServerErrorException(
        'No se pudo crear la carrera',
      );
    }
    return new SuccessResponseDto('Carrera creada con éxito', carrera);
  }


  @Get()
  @Roles('ADMIN', 'ASESOR', 'ASPIRANTE')
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Carrera>>> {
    if (query.limit && query.limit > 100) {
      query.limit = 100;
    }

    const result = await this.carreraService.findAll(query);

    if (!result) {
      throw new InternalServerErrorException(
        'No se pudieron obtener las carreras',
      );
    }

    return new SuccessResponseDto('Carreras obtenidas con éxito', result);
  }

  
  @Get(':id_carrera')
  @Roles('ADMIN', 'ASESOR', 'ASPIRANTE')
  async findOne(@Param('id_carrera') id_carrera: string) {
    const carrera = await this.carreraService.findOne(id_carrera);
    if (!carrera) {
      throw new NotFoundException('Carrera no encontrada');
    }
    return new SuccessResponseDto('Carrera obtenida con éxito', carrera);
  }


  @Put(':id_carrera')
  @Roles('ADMIN')
  async update(
    @Param('id_carrera') id_carrera: string,
    @Body() dto: UpdateCarreraDto,
  ) {
    const carrera = await this.carreraService.update(id_carrera, dto);
    if (!carrera) {
      throw new NotFoundException('Carrera no registrada');
    }
    return new SuccessResponseDto(
      'Carrera actualizada con éxito',
      carrera,
    );
  }

  
  @Delete(':id_carrera')
  @Roles('ADMIN')
  async remove(@Param('id_carrera') id_carrera: string) {
    const carrera = await this.carreraService.remove(id_carrera);
    if (!carrera) {
      throw new NotFoundException('Carrera no encontrada');
    }
    return new SuccessResponseDto(
      'Carrera eliminada con éxito',
      carrera,
    );
  }
}
