import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateDocumentosPostulacionDto {
  @IsUUID()
  @IsNotEmpty()
  id_postulacion: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  tipo_documento: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  nombre_archivo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  url_archivo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  estado_documento: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
