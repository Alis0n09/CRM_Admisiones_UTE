import {
  IsString,
  IsDateString,
  IsOptional,
} from 'class-validator';



export class UpdateTareaDto {
  @IsString ()
  id_asesor: string;

  @IsString ()
  id_contacto: string;
  
  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsDateString()
  fecha_asignacion?: string;

  @IsOptional()
  @IsDateString()
  fecha_vencimiento?: string;

  @IsOptional()
  @IsString()
  estado?: string;
}
