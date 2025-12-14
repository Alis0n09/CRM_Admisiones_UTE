import { IsOptional, IsString, Length, IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBecaEstudianteDto {

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fecha_asignacion?: Date;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  periodo_academico?: string;

  @IsOptional()
  @IsNumber()
  monto_otorgado?: number;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  estado?: string;
}
