import {
  IsUUID,
  IsString,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateRequisitoBecaDto {

  @IsUUID()
  id_beca: string;

  @IsString()
  descripcion: string;

  @IsOptional()
  @IsBoolean()
  obligatorio?: boolean;
}
