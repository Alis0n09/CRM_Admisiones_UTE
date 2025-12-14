import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentosPostulacion } from './entities/documento_postulacion.entity';
import { CreateDocumentosPostulacionDto } from './dto/create-documento_postulacion.dto';
import { UpdateDocumentosPostulacionDto } from './dto/update-documento_postulacion.dto';

@Injectable()
export class DocumentosPostulacionService {
  constructor(
    @InjectRepository(DocumentosPostulacion)
    private readonly repo: Repository<DocumentosPostulacion>,
  ) {}

  async create(dto: CreateDocumentosPostulacionDto): Promise<DocumentosPostulacion> {
    const doc = this.repo.create({
      postulacion: { id_postulacion: dto.id_postulacion } as any,
      tipo_documento: dto.tipo_documento,
      nombre_archivo: dto.nombre_archivo,
      url_archivo: dto.url_archivo,
      estado_documento: dto.estado_documento,
      observaciones: dto.observaciones,
    });

    return await this.repo.save(doc);
  }

  async findAll(): Promise<DocumentosPostulacion[]> {
    return await this.repo.find({
      relations: ['postulacion'],
    });
  }

  async findOne(id_documento: string): Promise<DocumentosPostulacion> {
    const doc = await this.repo.findOne({
      where: { id_documento },
      relations: ['postulacion'],
    });

    if (!doc) throw new NotFoundException('Documento de postulación no encontrado');
    return doc;
  }

  async update(
    id_documento: string,
    dto: UpdateDocumentosPostulacionDto,
  ): Promise<DocumentosPostulacion> {
    const doc = await this.findOne(id_documento);

    doc.postulacion = { id_postulacion: dto.id_postulacion } as any;
    doc.tipo_documento = dto.tipo_documento;
    doc.nombre_archivo = dto.nombre_archivo;
    doc.url_archivo = dto.url_archivo;
    doc.estado_documento = dto.estado_documento;
    doc.observaciones = dto.observaciones;

    return await this.repo.save(doc);
  }

  async remove(id_documento: string): Promise<void> {
    const doc = await this.findOne(id_documento);
    await this.repo.remove(doc);
  }
}
