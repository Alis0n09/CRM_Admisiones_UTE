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
import { BecaService } from './beca.service';
import { CreateBecaDto } from './dto/create-beca.dto';
import { UpdateBecaDto } from './dto/update-beca.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { Beca } from './entities/beca.entity';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard'; 
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('beca')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BecaController {
  constructor(private readonly becaService: BecaService) {}

  @Post()
  @Roles('ADMIN')
  async create(@Body() dto: CreateBecaDto) {
    const beca = await this.becaService.create(dto);
    if (!beca) throw new InternalServerErrorException('No se pudo crear la beca');
    return new SuccessResponseDto('Beca creada con éxito', beca);
  }

  @Get()
  @Roles('ADMIN', 'ASESOR', 'ASPIRANTE')
  async findAll(@Query() query: QueryDto): Promise<SuccessResponseDto<Pagination<Beca>>> {
    const result = await this.becaService.findAll(query);
    return new SuccessResponseDto('Becas obtenidas con éxito', result);
  }

  @Get(':id_beca')
  @Roles('ADMIN', 'ASESOR', 'ASPIRANTE')
  async findOne(@Param('id_beca') id_beca: string) {
    const beca = await this.becaService.findOne(id_beca);
    if (!beca) throw new NotFoundException('Beca no encontrada');
    return new SuccessResponseDto('Beca obtenida con éxito', beca);
  }

  @Put(':id_beca')
  @Roles('ADMIN', 'ASESOR')
  async update(@Param('id_beca') id_beca: string, @Body() dto: UpdateBecaDto) {
    const beca = await this.becaService.update(id_beca, dto);
    if (!beca) throw new NotFoundException('Beca no encontrada');
    return new SuccessResponseDto('Beca actualizada con éxito', beca);
  }

  @Delete(':id_beca')
  @Roles('ADMIN')
  async remove(@Param('id_beca') id_beca: string) {
    const beca = await this.becaService.remove(id_beca);
    if (!beca) throw new NotFoundException('Beca no encontrada');
    return new SuccessResponseDto('Beca eliminada con éxito', beca);
  }
}
