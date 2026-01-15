import {
  IsEmail,
  IsString,
  IsUUID,
  IsOptional,
  MinLength,
} from 'class-validator';
export class CreateUsuarioDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsUUID(undefined, { each: true })
  rolesIds?: string[];
}