import { Controller, Get, Post, Put, Delete, Body, Param, Query, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { AuditoriaService } from './auditoria.service';
import { CreateAuditoriaDto } from './dto/create-auditoria.dto';
import { UpdateAuditoriaDto } from './dto/update-auditoria.dto';
import { Auditoria } from './entities/auditoria.entity';
import { QueryDto } from 'src/common/dto/query.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('auditoria')
export class AuditoriaController {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  @Post()
  async create(@Body() dto: CreateAuditoriaDto) {
    const auditoria = await this.auditoriaService.create(dto);
    return new SuccessResponseDto('Auditoría creada con éxito', auditoria);
  }

  @Get()
  async findAll(@Query() query: QueryDto): Promise<SuccessResponseDto<Pagination<Auditoria>>> {
    if (query.limit && query.limit > 100) query.limit = 100;
    const result = await this.auditoriaService.findAll(query);
    if (!result) throw new InternalServerErrorException('No se pudieron obtener auditorías');
    return new SuccessResponseDto('Auditorías obtenidas con éxito', result);
  }

  @Get(':id_auditoria')
  async findOne(@Param('id_auditoria') id_auditoria: string) {
    const auditoria = await this.auditoriaService.findOne(id_auditoria);
    if (!auditoria) throw new NotFoundException('Auditoría no encontrada');
    return new SuccessResponseDto('Auditoría obtenida con éxito', auditoria);
  }

  @Put(':id_auditoria')
  async update(@Param('id_auditoria') id_auditoria: string, @Body() dto: UpdateAuditoriaDto) {
    const auditoria = await this.auditoriaService.update(id_auditoria, dto);
    if (!auditoria) throw new NotFoundException('Auditoría no encontrada');
    return new SuccessResponseDto('Auditoría actualizada con éxito', auditoria);
  }

  @Delete(':id_auditoria')
  async remove(@Param('id_auditoria') id_auditoria: string) {
    const auditoria = await this.auditoriaService.remove(id_auditoria);
    if (!auditoria) throw new NotFoundException('Auditoría no encontrada');
    return new SuccessResponseDto('Auditoría eliminada con éxito', auditoria);
  }
}
