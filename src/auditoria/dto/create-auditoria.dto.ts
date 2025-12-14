import {
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateAuditoriaDto {

  @IsString()
  usuario: string; // email o identificador del usuario logueado

  @IsOptional()
  @IsString()
  modulo?: string; // Usuarios, CRM, Admisiones, Becas, etc.

  @IsString()
  accion: string; // INSERT, UPDATE, DELETE, LOGIN

  @IsString()
  tabla_afectada: string;

  @IsOptional()
  @IsString()
  id_registro_afectado?: string;

  @IsOptional()
  @IsString()
  descripcion_cambio?: string;

  @IsOptional()
  @IsDateString()
  fecha_accion?: string; // opcional, por defecto Date.now

  @IsOptional()
  @IsString()
  ip_usuario?: string;

  @IsOptional()
  @IsString()
  terminal?: string;
}
