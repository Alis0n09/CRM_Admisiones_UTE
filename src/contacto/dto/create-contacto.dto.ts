import { IsString, IsOptional, IsEmail, Length } from 'class-validator';

export class CreateContactoDto {
  @IsString()
  @Length(1, 100)
  nombres: string;

  @IsString()
  @Length(1, 100)
  apellidos: string;

  @IsString()
  @Length(1, 20)
  tipo_identificacion: string;

  @IsString()
  @Length(1, 20)
  numero_identificacion: string;

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
  @Length(1, 20)
  celular?: string;

  @IsOptional()
  @IsString()
  @Length(1, 150)
  calle_principal?: string;

  @IsOptional()
  @IsString()
  @Length(1, 150)
  calle_secundaria?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  numero_casa?: string;

  @IsString()
  @Length(1, 50)
  origen: string;

  @IsOptional()
  fecha_contacto?: Date;

  @IsOptional()
  @IsString()
  @Length(1, 30)
  estado?: string;
}
