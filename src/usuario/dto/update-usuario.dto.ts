import {
  IsEmail,
  IsString,
  IsUUID,
  IsOptional,
  MinLength,
} from 'class-validator';

export class UpdateUsuarioDto {

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsUUID()
  id_asesor?: string; 

  @IsOptional()
  @IsUUID()
  id_aspirante?: string;

  @IsUUID()
  id_rol: string; 
}
