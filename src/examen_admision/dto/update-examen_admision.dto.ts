import {
  IsString,
  IsInt,
  IsDateString,
  Length,
  Min,
  IsNumberString,
} from 'class-validator';

export class UpdateExamenAdmisionDto {
  @IsString()
  @Length(1, 100)
  nombre_examen: string;

  @IsString()
  descripcion: string;

  @IsDateString()
  fecha_programada: string; 

  @IsInt()
  @Min(1)
  duracion_minutos: number;


  @IsNumberString()
  puntaje_minimo: string;
}
