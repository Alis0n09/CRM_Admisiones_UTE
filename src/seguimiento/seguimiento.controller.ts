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
import { SeguimientoService } from './seguimiento.service';
import { CreateSeguimientoDto } from './dto/create-seguimiento.dto';
import { UpdateSeguimientoDto } from './dto/update-seguimiento.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { Seguimiento } from './entities/seguimiento.entity';

@Controller('seguimiento')
export class SeguimientoController {
  constructor(private readonly seguimientoService: SeguimientoService) {}

  @Post()
  async create(@Body() dto: CreateSeguimientoDto) {
    const seguimiento = await this.seguimientoService.create(dto);
    if (!seguimiento) {
      throw new InternalServerErrorException(
        'No se pudo crear el seguimiento',
      );
    }
    return new SuccessResponseDto('Seguimiento creado con éxito', seguimiento);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Seguimiento>>> {
    if (query.limit && query.limit > 100) {
      query.limit = 100;
    }

    const result = await this.seguimientoService.findAll(query);

    if (!result) {
      throw new InternalServerErrorException(
        'No se pudieron obtener los seguimientos',
      );
    }

    return new SuccessResponseDto('Seguimientos obtenidos con éxito', result);
  }

  @Get(':id_seguimiento')
  async findOne(@Param('id_seguimiento') id_seguimiento: string) {
    const seguimiento = await this.seguimientoService.findOne(id_seguimiento);
    if (!seguimiento) {
      throw new NotFoundException('Seguimiento no encontrado');
    }
    return new SuccessResponseDto('Seguimiento obtenido con éxito', seguimiento);
  }

  @Put(':id_seguimiento')
  async update(
    @Param('id_seguimiento') id_seguimiento: string,
    @Body() dto: UpdateSeguimientoDto,
  ) {
    const seguimiento = await this.seguimientoService.update(
      id_seguimiento,
      dto,
    );
    if (!seguimiento) {
      throw new NotFoundException('Seguimiento no registrado');
    }
    return new SuccessResponseDto(
      'Seguimiento actualizado con éxito',
      seguimiento,
    );
  }

  @Delete(':id_seguimiento')
  async remove(@Param('id_seguimiento') id_seguimiento: string) {
    const seguimiento = await this.seguimientoService.remove(id_seguimiento);
    if (!seguimiento) {
      throw new NotFoundException('Seguimiento no encontrado');
    }
    return new SuccessResponseDto(
      'Seguimiento eliminado con éxito',
      seguimiento,
    );
  }
}
