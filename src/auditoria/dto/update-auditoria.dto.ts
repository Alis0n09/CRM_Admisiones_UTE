import { IsString, IsOptional, Length, IsInt, IsUUID } from 'class-validator';

export class UpdateAuditoriaDto {

  @IsString()
  @Length(1, 100)
  usuario: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  modulo?: string;

  @IsString()
  @Length(1, 20)
  accion: string;

  @IsString()
  @Length(1, 100)
  tabla_afectada: string;

  @IsOptional()
  @IsUUID()
  id_registro_afectado?: string;

  @IsOptional()
  @IsString()
  descripcion_cambio?: string;

  @IsOptional()
  fecha_accion?: Date;

  @IsOptional()
  @IsString()
  @Length(1, 45)
  ip_usuario?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  terminal?: string;
}
