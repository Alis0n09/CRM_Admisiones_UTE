import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuditoriaService } from './auditoria.service';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { Auditoria } from './entities/auditoria.schema';

@Controller('auditoria')
export class AuditoriaController {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  // ======================
  // CREATE
  // ======================
  @Post()
  async create(@Body() body: Partial<Auditoria>) {
    const auditoria = await this.auditoriaService.create(body);

    if (!auditoria)
      throw new InternalServerErrorException('No se pudo crear la auditoría');

    return new SuccessResponseDto('Auditoría creada con éxito', auditoria);
  }

  // ======================
  // FIND ALL (con filtros opcionales)
  // ======================
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

  // ======================
  // FIND ONE (por _id de Mongo)
  // ======================
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const auditoria = await this.auditoriaService.findOne(id);

    if (!auditoria) throw new NotFoundException('Auditoría no encontrada');

    return new SuccessResponseDto('Auditoría obtenida con éxito', auditoria);
  }

  // ======================
  // DELETE (opcional)
  // Nota: auditoría normalmente no se borra.
  // ======================
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const auditoria = await this.auditoriaService.remove(id);

    if (!auditoria) throw new NotFoundException('Auditoría no encontrada');

    return new SuccessResponseDto('Auditoría eliminada con éxito', auditoria);
  }
}
