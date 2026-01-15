import { IsString, IsOptional, Length, IsDateString, IsUUID } from 'class-validator';

export class UpdateMatriculaDto {
  @IsOptional()
  @IsUUID()
  id_cliente: string;
  
  @IsOptional()
  @IsUUID()
  id_carrera: string;

  @IsOptional()
  @IsDateString()
  fecha_matricula?: string;

  @IsString()
  @Length(1, 20)
  periodo_academico: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  estado?: string;
}

