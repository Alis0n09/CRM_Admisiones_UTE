import {
  IsUUID,
  IsString,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class UpdateRequisitoBecaDto {

  @IsUUID()
  id_beca: string;

  @IsString()
  descripcion: string;

  @IsOptional()
  @IsBoolean()
  obligatorio?: boolean;
}
