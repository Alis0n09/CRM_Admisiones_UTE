import { IsUUID, IsOptional, IsString, Length, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateContactoAspiranteDto {

  @IsOptional()
  @IsUUID()
  id_contacto?: string;

  @IsOptional()
  @IsUUID()
  id_aspirante?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fecha_vinculo?: Date;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  origen?: string;
}
