import { IsUUID } from 'class-validator';

export class CreateRolUsuarioDto {
  @IsUUID()
  id_usuario: string;

  @IsUUID()
  id_rol: string;
}