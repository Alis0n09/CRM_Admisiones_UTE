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
import { RequisitoBecaService } from './requisito_beca.service';
import { CreateRequisitoBecaDto } from './dto/create-requisito_beca.dto';
import { UpdateRequisitoBecaDto } from './dto/update-requisito_beca.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { RequisitoBeca } from './entities/requisito_beca.entity';

@Controller('requisito-beca')
export class RequisitoBecaController {
  constructor(
    private readonly requisitoBecaService: RequisitoBecaService,
  ) {}

  @Post()
  async create(@Body() dto: CreateRequisitoBecaDto) {
    const requisito = await this.requisitoBecaService.create(dto);

    if (!requisito)
      throw new InternalServerErrorException(
        'No se pudo crear el requisito de la beca',
      );

    return new SuccessResponseDto(
      'Requisito de beca creado con éxito',
      requisito,
    );
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<RequisitoBeca>>> {
    const result = await this.requisitoBecaService.findAll(query);

    return new SuccessResponseDto(
      'Requisitos de beca obtenidos con éxito',
      result,
    );
  }

  @Get(':id_requisito')
  async findOne(@Param('id_requisito') id_requisito: string) {
    const requisito = await this.requisitoBecaService.findOne(id_requisito);

    if (!requisito)
      throw new NotFoundException('Requisito de beca no encontrado');

    return new SuccessResponseDto(
      'Requisito de beca obtenido con éxito',
      requisito,
    );
  }

  @Put(':id_requisito')
  async update(
    @Param('id_requisito') id_requisito: string,
    @Body() dto: UpdateRequisitoBecaDto,
  ) {
    const requisito = await this.requisitoBecaService.update(
      id_requisito,
      dto,
    );

    if (!requisito)
      throw new NotFoundException('Requisito de beca no encontrado');

    return new SuccessResponseDto(
      'Requisito de beca actualizado con éxito',
      requisito,
    );
  }

  @Delete(':id_requisito')
  async remove(@Param('id_requisito') id_requisito: string) {
    const requisito = await this.requisitoBecaService.remove(id_requisito);

    if (!requisito)
      throw new NotFoundException('Requisito de beca no encontrado');

    return new SuccessResponseDto(
      'Requisito de beca eliminado con éxito',
      requisito,
    );
  }
}
