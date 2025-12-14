import {
  IsString,
  IsOptional,
  Length,
  IsDateString,
  IsDecimal,
} from 'class-validator';

export class CreateBecaDto {

  @IsString()
  @Length(1, 150)
  nombre_beca: string;

  @IsString()
  @Length(1, 100)
  tipo_beca: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsDecimal({ decimal_digits: '1,2' })
  porcentaje_cobertura: string;

  @IsOptional()
  @IsDecimal({ decimal_digits: '1,2' })
  monto_maximo?: string;

  @IsDateString()
  fecha_inicio: string;

  @IsOptional()
  @IsDateString()
  fecha_fin?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  estado?: string;
}
