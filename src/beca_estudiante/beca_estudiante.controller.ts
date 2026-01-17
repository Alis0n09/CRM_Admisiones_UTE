import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';

import { BecaEstudianteService } from './beca_estudiante.service';
import { CreateBecaEstudianteDto } from './dto/create-beca_estudiante.dto';
import { UpdateBecaEstudianteDto } from './dto/update-beca_estudiante.dto';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('becas-estudiantes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BecaEstudianteController {
  constructor(private readonly service: BecaEstudianteService) {}

  // ✅ Asignar beca a estudiante: Admin y Asesor
  @Post()
  @Roles('ADMIN', 'ASESOR')
  create(@Body() dto: CreateBecaEstudianteDto) {
    return this.service.create(dto);
  }

  // ✅ Ver asignaciones:
  // - Admin/Asesor ven todo
  // - Aspirante ve solo lo suyo
  @Get()
  @Roles('ADMIN', 'ASESOR', 'ASPIRANTE')
  findAll(@Req() req: any) {
    const roles: string[] = req.user?.roles ?? [];
    const isAspirante = roles.includes('ASPIRANTE');

    if (isAspirante) {
      const idCliente = req.user?.id_cliente;
      if (!idCliente) throw new ForbiddenException('Tu usuario no tiene cliente asociado');
      return this.service.findAllByCliente(idCliente);
    }

    return this.service.findAll();
  }

  // ✅ Ver una asignación:
  // - Admin/Asesor ven cualquiera
  // - Aspirante solo si es suya
  @Get(':id')
  @Roles('ADMIN', 'ASESOR', 'ASPIRANTE')
  findOne(@Param('id') id: string, @Req() req: any) {
    const roles: string[] = req.user?.roles ?? [];
    const isAspirante = roles.includes('ASPIRANTE');

    if (isAspirante) {
      const idCliente = req.user?.id_cliente;
      if (!idCliente) throw new ForbiddenException('Tu usuario no tiene cliente asociado');
      return this.service.findOneForCliente(id, idCliente);
    }

    return this.service.findOne(id);
  }

  // ✅ Update: Admin y Asesor
  @Put(':id')
  @Roles('ADMIN', 'ASESOR')
  update(@Param('id') id: string, @Body() dto: UpdateBecaEstudianteDto) {
    return this.service.update(id, dto);
  }

  // ✅ Delete: solo Admin (recomendado)
  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
