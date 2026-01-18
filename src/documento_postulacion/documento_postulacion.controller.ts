import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { DocumentosPostulacionService } from './documento_postulacion.service';
import { CreateDocumentosPostulacionDto } from './dto/create-documento_postulacion.dto';
import { UpdateDocumentosPostulacionDto } from './dto/update-documento_postulacion.dto';
import type { Request } from 'express';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('documentos-postulacion')
export class DocumentosPostulacionController {
  constructor(private readonly service: DocumentosPostulacionService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'ASESOR')
  @Post()
  async create(@Body() dto: CreateDocumentosPostulacionDto) {
    return await this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'ASESOR', 'ASPIRANTE')
  @Get()
  async findAll(@Req() req: Request) {
    const user: any = (req as any).user;

    const roles: string[] = user?.roles ?? [];
    const isAspirante = roles.includes('ASPIRANTE');

    if (isAspirante) {
      const idCliente = user?.id_cliente;
      if (!idCliente) {
        throw new ForbiddenException('Acceso no permitido');
      }
      return await this.service.findAllByClienteId(String(idCliente));
    }

    return await this.service.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'ASESOR', 'ASPIRANTE')
  @Get('por-usuario')
  async findAllByUsuario(@Req() req: Request) {
    const user: any = (req as any).user;
    return await this.service.findAllByUsuarioId(user.id_usuario);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'ASESOR')
  @Get(':id_documento')
  async findOne(@Param('id_documento') id_documento: string) {
    return await this.service.findOne(id_documento);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'ASESOR')
  @Put(':id_documento')
  async updatePut(
    @Param('id_documento') id_documento: string,
    @Body() dto: UpdateDocumentosPostulacionDto,
  ) {
    return await this.service.update(id_documento, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'ASESOR')
  @Patch(':id_documento')
  async updatePatch(
    @Param('id_documento') id_documento: string,
    @Body() dto: UpdateDocumentosPostulacionDto,
  ) {
    return await this.service.update(id_documento, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'ASESOR')
  @Delete(':id_documento')
  async remove(@Param('id_documento') id_documento: string) {
    await this.service.remove(id_documento);
    return { message: 'Documento eliminado correctamente' };
  }
}
