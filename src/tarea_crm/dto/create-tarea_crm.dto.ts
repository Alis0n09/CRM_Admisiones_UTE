import {
  IsInt,
  IsString,
  IsDateString,
  IsOptional,
  IsEnum,
  Length,
  IsUUID,
} from 'class-validator';

export class CreateTareaDto {
  @IsUUID()
  id_empleado: string;

  @IsUUID()
  id_cliente: string;

  @IsString()
  descripcion: string;

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

