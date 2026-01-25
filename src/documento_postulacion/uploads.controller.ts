import { BadRequestException, Controller, Get, Param, StreamableFile } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { createReadStream } from 'fs';

/**
 * Ruta pública para que el frontend pueda abrir/descargar directamente
 * (sin token en nueva pestaña), evitando 401/404 cuando se usa url_archivo.
 *
 * Sirve archivos desde: public/documentos-postulacion/
 * URL: /uploads/:filename
 */
@Controller('uploads')
export class UploadsController {
  @Get(':filename')
  async getUpload(@Param('filename') filename: string) {
    // Evitar path traversal
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
}

