import { IsString, IsOptional, Length, IsInt, Min } from 'class-validator';

export class CreateCarreraDto {
  @IsString()
  @Length(1, 150)
  nombre_carrera: string;

  @IsString()
  @Length(1, 100)
  facultad: string;

  @IsInt()
  @Min(1)
  duracion_semestres: number;

  @IsString()
  @Length(1, 50)
  nivel_grado: string;

  @IsInt()
  @Min(0)
  cupos_disponibles: number;

  @IsOptional()
  @IsString()
  @Length(1, 1)
  estado?: string;
}
