import { IsString, IsOptional, Length } from 'class-validator';

export class CreateRolDto {

  @IsString()
  @Length(3, 30)
  nombre: string; // ADMIN, ASESOR, ASPIRANTE

  @IsOptional()
  @IsString()
  descripcion?: string;
}
