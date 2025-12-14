import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ResultadoExamenService } from './resultado_examen.service';
import { CreateResultadoExamenDto } from './dto/create-resultado_examen.dto';
import { UpdateResultadoExamenDto } from './dto/update-resultado_examen.dto';

@Controller('resultado-examen')
export class ResultadoExamenController {
  constructor(private readonly service: ResultadoExamenService) {}

  @Post()
  async create(@Body() dto: CreateResultadoExamenDto) {
    return await this.service.create(dto);
  }

  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @Get(':id_resultado')
  async findOne(@Param('id_resultado') id_resultado: string) {
    return await this.service.findOne(id_resultado);
  }

  @Put(':id_resultado')
  async updatePut(
    @Param('id_resultado') id_resultado: string,
    @Body() dto: UpdateResultadoExamenDto,
  ) {
    return await this.service.update(id_resultado, dto);
  }

  @Patch(':id_resultado')
  async updatePatch(
    @Param('id_resultado') id_resultado: string,
    @Body() dto: UpdateResultadoExamenDto,
  ) {
    return await this.service.update(id_resultado, dto);
  }

  @Delete(':id_resultado')
  async remove(@Param('id_resultado') id_resultado: string) {
    await this.service.remove(id_resultado);
    return { message: 'Resultado eliminado correctamente' };
  }
}
