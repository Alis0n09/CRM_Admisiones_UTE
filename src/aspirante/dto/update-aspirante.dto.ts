import { IsString, IsOptional, Length, IsDateString, IsUUID } from 'class-validator';

export class UpdateAspiranteDto {
  @IsOptional()
  @IsUUID()
  id_contacto: string;

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
  fecha_nacimiento?: Date;
}