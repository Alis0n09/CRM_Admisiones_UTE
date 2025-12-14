import { IsUUID, IsOptional, IsString, Length, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateContactoAspiranteDto {

  @IsUUID()
  id_contacto: string;

  @IsUUID()
  id_aspirante: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fecha_vinculo?: Date;

  @IsString()
  @Length(1, 50)
  origen: string;
}
