import { IsDateString, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class UpdateResultadoExamenDto {
  @IsUUID()
  @IsNotEmpty()
  id_postulacion: string;

  @IsUUID()
  @IsNotEmpty()
  id_examen: string;

  @IsNumber()
  @IsNotEmpty()
  puntaje_obtenido: number;

  @IsDateString()
  @IsNotEmpty()
  fecha_resultado: Date;
}
