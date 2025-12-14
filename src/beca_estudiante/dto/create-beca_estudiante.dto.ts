import { IsUUID, IsString, IsOptional, Length, IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBecaEstudianteDto {

  @IsUUID()
  id_beca: string;

  @IsUUID()
  id_aspirante: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fecha_asignacion?: Date;

  @IsString()
  @Length(1, 20)
  periodo_academico: string;

  @IsNumber()
  monto_otorgado: number;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  estado?: string;
}
