import {
  IsUUID,
  IsString,
  IsOptional,
  IsIn,
  IsNumberString,
} from 'class-validator';

export class CreateBecaEstudianteDto {
  @IsUUID()
  id_beca: string;

  @IsUUID()
  id_cliente: string;

  @IsString()
  periodo_academico: string;

  @IsNumberString()
  monto_otorgado: string;

  @IsOptional()
  @IsString()
  fecha_asignacion?: string;

  @IsOptional()
  @IsIn(['Vigente', 'Suspendida', 'Finalizada'])
  estado?: string;
}
