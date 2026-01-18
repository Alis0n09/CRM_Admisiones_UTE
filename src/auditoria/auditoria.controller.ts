import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { AuditoriaService } from './auditoria.service';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { Auditoria } from './entities/auditoria.schema';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('auditoria')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN') 
export class AuditoriaController {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  @Get()
  async findAll(
    @Query('usuario') usuario?: string,
    @Query('modulo') modulo?: string,
    @Query('accion') accion?: string,
    @Query('tabla_afectada') tabla_afectada?: string,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ): Promise<SuccessResponseDto<Auditoria[]>> {
    const result = await this.auditoriaService.findAll({
      usuario,
      modulo,
      accion,
      tabla_afectada,
      desde,
      hasta,
    });
    return new SuccessResponseDto('Auditorías obtenidas con éxito', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const auditoria = await this.auditoriaService.findOne(id);
    if (!auditoria) throw new NotFoundException('Auditoría no encontrada');
    return new SuccessResponseDto('Auditoría obtenida con éxito', auditoria);
  }
}
