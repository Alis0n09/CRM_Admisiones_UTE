import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';

import { BecaEstudianteService } from './beca_estudiante.service';
import { CreateBecaEstudianteDto } from './dto/create-beca_estudiante.dto';
import { UpdateBecaEstudianteDto } from './dto/update-beca_estudiante.dto';

@Controller('becas-estudiantes')
export class BecaEstudianteController {
  constructor(private readonly service: BecaEstudianteService) {}

  @Post()
  create(@Body() dto: CreateBecaEstudianteDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBecaEstudianteDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
