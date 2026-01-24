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

  async findAllByPostulacion(id_postulacion: string): Promise<DocumentosPostulacion[]> {
    return await this.repo
      .createQueryBuilder('doc')
      .leftJoinAndSelect('doc.postulacion', 'postulacion')
      .where('postulacion.id_postulacion = :id_postulacion', { id_postulacion })
      .getMany();
  }

  async findAllByClienteId(id_cliente: string): Promise<DocumentosPostulacion[]> {
    const postulaciones = await this.postulacionService.findAllByUsuarioId(id_cliente);
    if (!postulaciones?.length) return [];

    const ids = postulaciones.map((p) => p.id_postulacion);

    return await this.repo
      .createQueryBuilder('doc')
      .leftJoinAndSelect('doc.postulacion', 'postulacion')
      .where('postulacion.id_postulacion IN (:...ids)', { ids })
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

    return await this.repo.save(doc);
  }

  async remove(id_documento: string): Promise<void> {
    const doc = await this.findOne(id_documento);
    await this.repo.remove(doc);
  }
}
