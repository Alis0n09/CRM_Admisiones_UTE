import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsEmail,
  Length,
} from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  nombres: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  apellidos: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  tipo_identificacion: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  numero_identificacion: string;

  @IsOptional()
  @IsEmail()
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

  @IsOptional()
  @IsString()
  @Length(1, 50)
  nacionalidad?: string;

  @IsOptional()
  @IsString()
  @Length(1, 1)
  genero?: string;

  @IsOptional()
  @IsString()
  @Length(1, 30)
  estado_civil?: string;

  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  origen: string;
}
