import {
  IsUUID,
  IsString,
  IsOptional,
  IsIn,
  IsNumberString,
} from 'class-validator';

export class UpdateBecaEstudianteDto {
  @IsOptional()
  @IsUUID()
  id_beca?: string;

  @IsOptional()
  @IsUUID()
  id_cliente?: string;

  @IsOptional()
  @IsString()
  periodo_academico?: string;

  @IsOptional()
  @IsNumberString()
  monto_otorgado?: string;

  @IsOptional()
  @IsString()
  fecha_asignacion?: string;

  @IsOptional()
  @IsIn(['Vigente', 'Suspendida', 'Finalizada'])
  estado?: string;
}
