import {
  IsInt,
  IsString,
  IsDateString,
  IsOptional,
  IsEnum,
  Length,
} from 'class-validator';
import { UUID } from 'typeorm/driver/mongodb/bson.typings.js';


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
