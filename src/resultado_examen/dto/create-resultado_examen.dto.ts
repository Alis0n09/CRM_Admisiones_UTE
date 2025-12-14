import { Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateResultadoExamenDto {
  @IsUUID()
  @IsNotEmpty()
  id_postulacion: string;

  @IsUUID()
  @IsNotEmpty()
  id_examen: string;

  @Type(() => Number) // convierte "99.5" -> 99.5 si llega como string
  @IsNumber()
  @IsNotEmpty()
  puntaje_obtenido: number;

  @IsDateString()
  @IsNotEmpty()
  fecha_resultado: Date;
}
