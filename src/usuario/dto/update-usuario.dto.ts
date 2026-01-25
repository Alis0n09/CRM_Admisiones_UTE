import {
  IsEmail,
  IsString,
  IsUUID,
  IsOptional,
  MinLength,
  IsBoolean,
} from 'class-validator';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'password must be longer than or equal to 6 characters' })
  password?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsUUID(undefined, { each: true })
  rolesIds?: string[];
}