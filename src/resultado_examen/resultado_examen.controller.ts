import { Body, Controller, Get, Param, Patch, Post, Delete } from '@nestjs/common';
import { ResultadoExamenService } from './resultado_examen.service';
import { CreateResultadoExamenDto } from './dto/create-resultado_examen.dto';
import { UpdateResultadoExamenDto } from './dto/update-resultado_examen.dto';

@Controller('resultado-examen') //
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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.service.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateResultadoExamenDto,
  ) {
    return await this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'Resultado eliminado correctamente' };
  }
}
