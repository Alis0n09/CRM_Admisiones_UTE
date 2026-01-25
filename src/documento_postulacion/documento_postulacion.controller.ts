import {
  Body,
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
  Req,
  ForbiddenException,
  UploadedFile,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { createReadStream } from 'fs';
import { DocumentosPostulacionService } from './documento_postulacion.service';
import { CreateDocumentosPostulacionDto } from './dto/create-documento_postulacion.dto';
import { UpdateDocumentosPostulacionDto } from './dto/update-documento_postulacion.dto';
import type { Request } from 'express';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { PostulacionService } from 'src/postulacion/postulacion.service';

@Controller('documentos-postulacion')
export class DocumentosPostulacionController {
  constructor(
    private readonly service: DocumentosPostulacionService,
    private readonly postulacionService: PostulacionService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'ASESOR', 'ASPIRANTE')
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const uploadDir = path.join(process.cwd(), 'public', 'documentos-postulacion');
          fs.mkdirSync(uploadDir, { recursive: true });
          cb(null, uploadDir);
        },
        filename: (_req, file, cb) => {
          const ext = path.extname(file.originalname || '');
          const safeExt = ext && ext.length <= 10 ? ext : '';
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${safeExt}`);
        },
      }),
      limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
      fileFilter: (_req, file, cb) => {
        const allowed = [
          'application/pdf',
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/webp',
        ];
        if (!allowed.includes(file.mimetype)) {
          return cb(new BadRequestException('Tipo de archivo no permitido (solo PDF/imagenes)'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadDocumento(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file) {
      throw new BadRequestException('Archivo requerido');
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const url_archivo = `${baseUrl}/uploads/${file.filename}`;
    const url_segura = `${baseUrl}/documentos-postulacion/files/${file.filename}`;

    return {
      url_archivo,
      url_segura,
      nombre_archivo: file.originalname,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'ASESOR', 'ASPIRANTE')
  @Get('files/:filename')
  async getDocumentoFile(@Param('filename') filename: string) {
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      throw new BadRequestException('Nombre de archivo inválido');
    }

    const filePath = path.join(process.cwd(), 'public', 'documentos-postulacion', filename);
    if (!fs.existsSync(filePath)) {
      throw new BadRequestException('Archivo no encontrado');
    }

    const file = createReadStream(filePath);
    return new StreamableFile(file);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'ASESOR', 'ASPIRANTE')
  @Post()
  async create(@Body() dto: CreateDocumentosPostulacionDto, @Req() req: Request) {
    const user: any = (req as any).user;
    const roles: string[] = user?.roles ?? [];
    const isAspirante = roles.includes('ASPIRANTE');

    const postulacion = await this.postulacionService.findOne(dto.id_postulacion);
    if (!postulacion) {
      throw new ForbiddenException('La postulación no existe');
    }

    if (isAspirante) {
      const idCliente = user?.id_cliente;
      if (!idCliente) {
        throw new ForbiddenException('Acceso no permitido');
      }

      if (postulacion.cliente.id_cliente !== idCliente) {
        throw new ForbiddenException('No tiene permiso para crear documentos en esta postulación');
      }
    }

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
  @Get('por-postulacion/:id_postulacion')
  async findAllByPostulacion(
    @Param('id_postulacion') id_postulacion: string,
    @Req() req: Request,
  ) {
    const user: any = (req as any).user;
    const roles: string[] = user?.roles ?? [];
    const isAspirante = roles.includes('ASPIRANTE');

    const postulacion = await this.postulacionService.findOne(id_postulacion);
    if (!postulacion) {
      throw new ForbiddenException('La postulación no existe');
    }

    if (isAspirante) {
      const idCliente = user?.id_cliente;
      if (!idCliente) {
        throw new ForbiddenException('Acceso no permitido');
      }

      if (postulacion.cliente.id_cliente !== idCliente) {
        throw new ForbiddenException('No tiene permiso para ver documentos de esta postulación');
      }
    }

    return await this.service.findAllByPostulacion(id_postulacion);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'ASESOR', 'ASPIRANTE')
  @Get('por-usuario')
  async findAllByUsuario(@Req() req: Request) {
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
    return await this.service.findAllByUsuarioId(user.id_usuario);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'ASESOR', 'ASPIRANTE')
  @Get(':id_documento')
  async findOne(@Param('id_documento') id_documento: string, @Req() req: Request) {
    const user: any = (req as any).user;
    const roles: string[] = user?.roles ?? [];
    const isAspirante = roles.includes('ASPIRANTE');

    const documento = await this.service.findOne(id_documento);

    if (isAspirante) {
      const idCliente = user?.id_cliente;
      if (!idCliente) {
        throw new ForbiddenException('Acceso no permitido');
      }

      if (!documento || !documento.postulacion) {
        throw new ForbiddenException('Documento no encontrado');
      }

      const postulacion = await this.postulacionService.findOne(documento.postulacion.id_postulacion);
      if (!postulacion || postulacion.cliente.id_cliente !== idCliente) {
        throw new ForbiddenException('No tiene permiso para ver este documento');
      }
    }

    return documento;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'ASESOR', 'ASPIRANTE')
  @Put(':id_documento')
  async updatePut(
    @Param('id_documento') id_documento: string,
    @Body() dto: UpdateDocumentosPostulacionDto,
    @Req() req: Request,
  ) {
    const user: any = (req as any).user;
    const roles: string[] = user?.roles ?? [];
    const isAspirante = roles.includes('ASPIRANTE');

    const documentoExistente = await this.service.findOne(id_documento);
    if (!documentoExistente || !documentoExistente.postulacion) {
      throw new ForbiddenException('Documento no encontrado');
    }

    if (isAspirante) {
      const idCliente = user?.id_cliente;
      if (!idCliente) {
        throw new ForbiddenException('Acceso no permitido');
      }

      const postulacion = await this.postulacionService.findOne(documentoExistente.postulacion.id_postulacion);
      if (!postulacion || postulacion.cliente.id_cliente !== idCliente) {
        throw new ForbiddenException('No tiene permiso para actualizar este documento');
      }

      if (dto.id_postulacion && dto.id_postulacion !== documentoExistente.postulacion.id_postulacion) {
        const nuevaPostulacion = await this.postulacionService.findOne(dto.id_postulacion);
        if (!nuevaPostulacion) {
          throw new ForbiddenException('La nueva postulación no existe');
        }
        if (nuevaPostulacion.cliente.id_cliente !== idCliente) {
          throw new ForbiddenException('No tiene permiso para mover el documento a esta postulación');
        }
      }
    } else {
      if (dto.id_postulacion && dto.id_postulacion !== documentoExistente.postulacion.id_postulacion) {
        const nuevaPostulacion = await this.postulacionService.findOne(dto.id_postulacion);
        if (!nuevaPostulacion) {
          throw new ForbiddenException('La nueva postulación no existe');
        }
      }
    }

    return await this.service.update(id_documento, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'ASESOR', 'ASPIRANTE')
  @Patch(':id_documento')
  async updatePatch(
    @Param('id_documento') id_documento: string,
    @Body() dto: UpdateDocumentosPostulacionDto,
    @Req() req: Request,
  ) {
    const user: any = (req as any).user;
    const roles: string[] = user?.roles ?? [];
    const isAspirante = roles.includes('ASPIRANTE');

    const documentoExistente = await this.service.findOne(id_documento);
    if (!documentoExistente || !documentoExistente.postulacion) {
      throw new ForbiddenException('Documento no encontrado');
    }

    if (isAspirante) {
      const idCliente = user?.id_cliente;
      if (!idCliente) {
        throw new ForbiddenException('Acceso no permitido');
      }

      const postulacion = await this.postulacionService.findOne(documentoExistente.postulacion.id_postulacion);
      if (!postulacion || postulacion.cliente.id_cliente !== idCliente) {
        throw new ForbiddenException('No tiene permiso para actualizar este documento');
      }

      if (dto.id_postulacion && dto.id_postulacion !== documentoExistente.postulacion.id_postulacion) {
        const nuevaPostulacion = await this.postulacionService.findOne(dto.id_postulacion);
        if (!nuevaPostulacion) {
          throw new ForbiddenException('La nueva postulación no existe');
        }
        if (nuevaPostulacion.cliente.id_cliente !== idCliente) {
          throw new ForbiddenException('No tiene permiso para mover el documento a esta postulación');
        }
      }
    } else {
      if (dto.id_postulacion && dto.id_postulacion !== documentoExistente.postulacion.id_postulacion) {
        const nuevaPostulacion = await this.postulacionService.findOne(dto.id_postulacion);
        if (!nuevaPostulacion) {
          throw new ForbiddenException('La nueva postulación no existe');
        }
      }
    }

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
