import { IsString, IsOptional, IsDateString, Length, IsUUID} from 'class-validator';

export class CreateSeguimientoDto {
  @IsUUID()
  id_contacto: string;

  @IsOptional()
  @IsDateString()
  fecha_contacto?: string; // formato: 'YYYY-MM-DD'

  @IsOptional()
  @IsString()
  @Length(1, 50)
  medio?: string;

  @IsOptional()
  @IsString()
  comentarios?: string;

  @IsOptional()
  @IsString()
  proximo_paso?: string;

  @IsOptional()
  @IsDateString()
  fecha_proximo_contacto?: string; // formato: 'YYYY-MM-DD'
}
