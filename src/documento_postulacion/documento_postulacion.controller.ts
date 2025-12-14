import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { DocumentosPostulacionService } from './documento_postulacion.service';
import { CreateDocumentosPostulacionDto } from './dto/create-documento_postulacion.dto';
import { UpdateDocumentosPostulacionDto } from './dto/update-documento_postulacion.dto';

@Controller('documentos-postulacion')
export class DocumentosPostulacionController {
  constructor(private readonly service: DocumentosPostulacionService) {}

  @Post()
  async create(@Body() dto: CreateDocumentosPostulacionDto) {
    return await this.service.create(dto);
  }

  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @Get(':id_documento')
  async findOne(@Param('id_documento') id_documento: string) {
    return await this.service.findOne(id_documento);
  }


  @Put(':id_documento')
  async updatePut(
    @Param('id_documento') id_documento: string,
    @Body() dto: UpdateDocumentosPostulacionDto,
  ) {
    return await this.service.update(id_documento, dto);
  }


  @Patch(':id_documento')
  async updatePatch(
    @Param('id_documento') id_documento: string,
    @Body() dto: UpdateDocumentosPostulacionDto,
  ) {
    return await this.service.update(id_documento, dto);
  }


  @Delete(':id_documento')
  async remove(@Param('id_documento') id_documento: string) {
    await this.service.remove(id_documento);
    return { message: 'Documento eliminado correctamente' };
  }
}
