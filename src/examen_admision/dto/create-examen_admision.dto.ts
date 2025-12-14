import {
  IsString,
  IsInt,
  IsDateString,
  Length,
  Min,
  IsNumberString,
} from 'class-validator';

export class CreateExamenAdmisionDto {
  @IsString()
  @Length(1, 100)
  nombre_examen: string;

  @IsString()
  descripcion: string;

  @IsDateString()
  fecha_programada: string; // YYYY-MM-DD

  @IsInt()
  @Min(1)
  duracion_minutos: number;

  // decimal(5,2) → se maneja como string
  @IsNumberString()
  puntaje_minimo: string;
}
