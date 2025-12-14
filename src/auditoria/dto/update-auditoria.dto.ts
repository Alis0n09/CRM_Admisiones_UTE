import {
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class UpdateAuditoriaDto {

  @IsOptional()
  @IsString()
  usuario?: string;

  @IsOptional()
  @IsString()
  modulo?: string;

  @IsOptional()
  @IsString()
  accion?: string;

  @IsOptional()
  @IsString()
  tabla_afectada?: string;

  @IsOptional()
  @IsString()
  id_registro_afectado?: string;

  @IsOptional()
  @IsString()
  descripcion_cambio?: string;

  @IsOptional()
  @IsDateString()
  fecha_accion?: string;

  @IsOptional()
  @IsString()
  ip_usuario?: string;

  @IsOptional()
  @IsString()
  terminal?: string;
}
