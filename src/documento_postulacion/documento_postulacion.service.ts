import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentosPostulacion } from './entities/documento_postulacion.entity';
import { CreateDocumentosPostulacionDto } from './dto/create-documento_postulacion.dto';
import { UpdateDocumentosPostulacionDto } from './dto/update-documento_postulacion.dto';
import { PostulacionService } from 'src/postulacion/postulacion.service';

@Injectable()
export class DocumentosPostulacionService {
  constructor(
    @InjectRepository(DocumentosPostulacion)
    private readonly repo: Repository<DocumentosPostulacion>,
    private readonly postulacionService: PostulacionService,
  ) {}

  async findExistingByTipoAndPostulacion(
    tipo_documento: string,
    id_postulacion: string,
  ): Promise<DocumentosPostulacion | null> {
    return await this.repo.findOne({
      where: {
        tipo_documento,
        postulacion: { id_postulacion } as any,
      },
      relations: ['postulacion'],
    });
  }

  async create(dto: CreateDocumentosPostulacionDto): Promise<DocumentosPostulacion> {
    // Verificar si ya existe un documento del mismo tipo para esta postulación
    const documentoExistente = await this.findExistingByTipoAndPostulacion(
      dto.tipo_documento,
      dto.id_postulacion,
    );

    if (documentoExistente) {
      // Si existe, actualizar el documento existente en lugar de crear uno nuevo
      documentoExistente.nombre_archivo = dto.nombre_archivo;
      documentoExistente.url_archivo = dto.url_archivo;
      documentoExistente.estado_documento = dto.estado_documento || documentoExistente.estado_documento || 'Pendiente';
      if (dto.observaciones !== undefined) {
        documentoExistente.observaciones = dto.observaciones;
      }

      const saved = await this.repo.save(documentoExistente);
      
      // Retornar el documento actualizado con todas sus relaciones
      return await this.repo.findOne({
        where: { id_documento: saved.id_documento },
        relations: ['postulacion', 'postulacion.cliente', 'postulacion.carrera'],
      }) || saved;
    }

    // Si no existe, crear uno nuevo
    const doc = this.repo.create({
      postulacion: { id_postulacion: dto.id_postulacion } as any,
      tipo_documento: dto.tipo_documento,
      nombre_archivo: dto.nombre_archivo,
      url_archivo: dto.url_archivo,
      estado_documento: dto.estado_documento || 'Pendiente',
      observaciones: dto.observaciones,
    });

    const saved = await this.repo.save(doc);
    
    // Retornar el documento con todas sus relaciones
    return await this.repo.findOne({
      where: { id_documento: saved.id_documento },
      relations: ['postulacion', 'postulacion.cliente', 'postulacion.carrera'],
    }) || saved;
  }

  async findAll(): Promise<DocumentosPostulacion[]> {
    return await this.repo.find({
      relations: ['postulacion', 'postulacion.cliente', 'postulacion.carrera'],
      order: { created_at: 'DESC' },
    });
  }

  async findAllByPostulacion(id_postulacion: string): Promise<DocumentosPostulacion[]> {
    return await this.repo
      .createQueryBuilder('doc')
      .leftJoinAndSelect('doc.postulacion', 'postulacion')
      .leftJoinAndSelect('postulacion.cliente', 'cliente')
      .leftJoinAndSelect('postulacion.carrera', 'carrera')
      .where('postulacion.id_postulacion = :id_postulacion', { id_postulacion })
      .orderBy('doc.created_at', 'DESC')
      .getMany();
  }

  async findAllByClienteId(id_cliente: string): Promise<DocumentosPostulacion[]> {
    const postulaciones = await this.postulacionService.findAllByUsuarioId(id_cliente);
    if (!postulaciones?.length) return [];

    const ids = postulaciones.map((p) => p.id_postulacion);

    return await this.repo
      .createQueryBuilder('doc')
      .leftJoinAndSelect('doc.postulacion', 'postulacion')
      .leftJoinAndSelect('postulacion.cliente', 'cliente')
      .leftJoinAndSelect('postulacion.carrera', 'carrera')
      .where('postulacion.id_postulacion IN (:...ids)', { ids })
      .orderBy('doc.created_at', 'DESC')
      .getMany();
  }

  async findAllByUsuarioId(usuarioId: string | number): Promise<DocumentosPostulacion[]> {
    const postulaciones = await this.postulacionService.findAllByUsuarioId(usuarioId);
    if (!postulaciones?.length) return [];
    return await this.findAllByPostulacion(postulaciones[0].id_postulacion);
  }

  async findOne(id_documento: string): Promise<DocumentosPostulacion> {
    const doc = await this.repo.findOne({
      where: { id_documento },
      relations: ['postulacion'],
    });

    if (!doc) throw new NotFoundException('Documento de postulación no encontrado');
    return doc;
  }

  async findOneOwnedByPostulacion(
    id_documento: string,
    id_postulacion: string,
  ): Promise<DocumentosPostulacion> {
    const doc = await this.repo
      .createQueryBuilder('doc')
      .leftJoinAndSelect('doc.postulacion', 'postulacion')
      .where('doc.id_documento = :id_documento', { id_documento })
      .andWhere('postulacion.id_postulacion = :id_postulacion', { id_postulacion })
      .getOne();

    if (!doc) {
      throw new NotFoundException('Documento de postulación no encontrado');
    }

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

    const saved = await this.repo.save(doc);
    
    // Retornar el documento con todas sus relaciones
    return await this.repo.findOne({
      where: { id_documento: saved.id_documento },
      relations: ['postulacion', 'postulacion.cliente', 'postulacion.carrera'],
    }) || saved;
  }

  async remove(id_documento: string): Promise<void> {
    const doc = await this.findOne(id_documento);
    await this.repo.remove(doc);
  }
}
