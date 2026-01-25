import { BadRequestException, Controller, Get, Param, StreamableFile } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { createReadStream } from 'fs';

@Controller('uploads')
export class UploadsController {
  @Get(':filename')
  async getUpload(@Param('filename') filename: string) {
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

