import { IsString, IsOptional, Length, IsEmail } from 'class-validator';

export class UpdateEmpleadoDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  nombres?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  apellidos?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  tipo_identificacion?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  numero_identificacion?: string;

  @IsOptional()
  @IsEmail()
  @Length(1, 120)
  correo?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  telefono?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  departamento?: string;
}
