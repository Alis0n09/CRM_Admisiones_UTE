import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  NotFoundException,
  InternalServerErrorException,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { PostulacionService } from './postulacion.service';
import { CreatePostulacionDto } from './dto/create-postulacion.dto';
import { UpdatePostulacionDto } from './dto/update-postulacion.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { Postulacion } from './entities/postulacion.entity';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('postulacion')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PostulacionController {
  constructor(private readonly postulacionService: PostulacionService) {}

  @Post()
  @Roles('ADMIN', 'ASESOR')
  async create(@Body() dto: CreatePostulacionDto) {
    const postulacion = await this.postulacionService.create(dto);
    if (!postulacion) {
      throw new InternalServerErrorException('No se pudo crear la postulación');
    }
    return new SuccessResponseDto('Postulación creada con éxito', postulacion);
  }

  @Get()
  @Roles('ADMIN', 'ASESOR', 'ASPIRANTE')
  async findAll(
    @Query() query: QueryDto,
    @Req() req: any,
  ): Promise<SuccessResponseDto<Pagination<Postulacion> | Postulacion[]>> {
    const roles: string[] = req.user?.roles ?? [];
    const isAspirante = roles.includes('ASPIRANTE');

    if (isAspirante) {
      const idCliente = req.user?.id_cliente;

      if (!idCliente) {
        throw new ForbiddenException('Acceso no permitido');
      }

      const result = await this.postulacionService.findAllByClienteId(
        String(idCliente),
        query,
      );

      return new SuccessResponseDto('Postulaciones obtenidas con éxito', result);
    }

    const result = await this.postulacionService.findAll(query);
    return new SuccessResponseDto('Postulaciones obtenidas con éxito', result);
  }

  @Get('activa')
  @Roles('ADMIN', 'ASESOR', 'ASPIRANTE')
  async findActive(@Query('id_cliente') idClienteQuery: string, @Req() req: any) {
    const roles: string[] = req.user?.roles ?? [];
    const isAspirante = roles.includes('ASPIRANTE');
    const isAsesor = roles.includes('ASESOR');
    const isAdmin = roles.includes('ADMIN');

    let idCliente: string | undefined;

    if (isAspirante) {
      idCliente = req.user?.id_cliente;
      if (!idCliente) {
        throw new ForbiddenException('Acceso no permitido. No se encontró información del cliente.');
      }
    } else if (isAsesor || isAdmin) {
      idCliente = idClienteQuery || req.user?.id_cliente;
      if (!idCliente) {
        throw new ForbiddenException('Debe especificar el id_cliente como parámetro de consulta.');
      }
    } else {
      throw new ForbiddenException('Acceso no permitido');
    }

    try {
      const postulacion = await this.postulacionService.findActiveByClienteId(String(idCliente));
      if (!postulacion) {
        throw new NotFoundException('No se encontró una postulación activa. Por favor recarga la página.');
      }

      return new SuccessResponseDto('Postulación activa obtenida con éxito', postulacion);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('No se pudo obtener la postulación. Por favor verifica tu sesión o contacta al administrador.');
    }
  }

  @Get(':id_postulacion')
  @Roles('ADMIN', 'ASESOR', 'ASPIRANTE')
  async findOne(
    @Param('id_postulacion') id_postulacion: string,
    @Req() req: any,
  ) {
    const postulacion = await this.postulacionService.findOne(id_postulacion);
    if (!postulacion) {
      throw new NotFoundException('Postulación no encontrada');
    }

    const roles: string[] = req.user?.roles ?? [];
    const isAspirante = roles.includes('ASPIRANTE');

    if (isAspirante) {
      const idCliente = req.user?.id_cliente;
      const postulacionClienteId = (postulacion as any)?.cliente?.id_cliente;

      if (
        !idCliente ||
        !postulacionClienteId ||
        String(postulacionClienteId) !== String(idCliente)
      ) {
        throw new ForbiddenException('Acceso no permitido');
      }
    }

    return new SuccessResponseDto('Postulación obtenida con éxito', postulacion);
  }

  @Put(':id_postulacion')
  @Roles('ADMIN', 'ASESOR')
  async update(
    @Param('id_postulacion') id_postulacion: string,
    @Body() dto: UpdatePostulacionDto,
  ) {
    const postulacion = await this.postulacionService.update(
      id_postulacion,
      dto,
    );
    if (!postulacion) {
      throw new NotFoundException('Postulación no encontrada');
    }
    return new SuccessResponseDto(
      'Postulación actualizada con éxito',
      postulacion,
    );
  }

  @Delete(':id_postulacion')
  @Roles('ADMIN', 'ASESOR')
  async remove(@Param('id_postulacion') id_postulacion: string) {
    const postulacion = await this.postulacionService.remove(id_postulacion);
    if (!postulacion) {
      throw new NotFoundException('Postulación no encontrada');
    }
    return new SuccessResponseDto(
      'Postulación eliminada con éxito',
      postulacion,
    );
  }
}
