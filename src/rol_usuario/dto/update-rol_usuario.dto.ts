import { IsUUID, IsOptional } from 'class-validator';

export class UpdateRolUsuarioDto {
  @IsOptional()
  @IsUUID()
  id_usuario?: string;

  @IsOptional()
  @IsUUID()
  id_rol?: string;
}