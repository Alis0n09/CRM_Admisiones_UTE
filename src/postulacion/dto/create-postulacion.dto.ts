import { IsOptional, IsString, Length, IsUUID, IsDateString } from 'class-validator';

export class CreatePostulacionDto {

  @IsUUID()
  id_cliente: string;

  @IsUUID()
  id_carrera: string;

  @IsString()
  @Length(1, 20)
  periodo_academico: string;

  @IsOptional()
  @IsDateString()
  fecha_postulacion?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  estado_postulacion?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
