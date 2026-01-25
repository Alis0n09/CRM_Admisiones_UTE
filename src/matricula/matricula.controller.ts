import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  NotFoundException,
  InternalServerErrorException,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import type { Request } from 'express';
import { Pagination } from 'nestjs-typeorm-paginate';
import { MatriculaService } from './matricula.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { Matricula } from './entities/matricula.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('matricula')
@UseGuards(JwtAuthGuard)
export class MatriculaController {
  constructor(private readonly matriculaService: MatriculaService) {}

  private getRoleFlags(req: Request) {
    const user: any = (req as any).user;

    const rolesRaw = user?.roles;
    const roles: string[] = Array.isArray(rolesRaw) ? rolesRaw : [];
    const normRoles = roles.map((r) => String(r).trim().toUpperCase());

    const isAdmin = normRoles.includes('ADMIN');
    const isAsesor = normRoles.includes('ASESOR');
    const isAspirante = normRoles.includes('ASPIRANTE');
    const isPrivileged = isAdmin || isAsesor;

    return { user, normRoles, isAdmin, isAsesor, isAspirante, isPrivileged };
  }

  @Post()
  async create(@Body() dto: CreateMatriculaDto, @Req() req: Request) {
    const { user, isAspirante, isPrivileged } = this.getRoleFlags(req);
    if (!isPrivileged && !isAspirante) {
      throw new ForbiddenException('No tienes permisos');
    }
    if (!isPrivileged && isAspirante) {
      if (!user?.id_cliente) throw new ForbiddenException('Cliente no válido');
      (dto as any).id_cliente = user.id_cliente;
    }

    const matricula = await this.matriculaService.create(dto);

    if (!matricula) {
      throw new InternalServerErrorException('No se pudo crear la matrícula');
    }

    return new SuccessResponseDto('Matrícula creada con éxito', matricula);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
    @Req() req: Request,
  ): Promise<SuccessResponseDto<Pagination<Matricula>>> {
    const { isPrivileged } = this.getRoleFlags(req);
    if (!isPrivileged) {
      throw new ForbiddenException('No tienes permisos');
    }

    const result = await this.matriculaService.findAll(query);
    return new SuccessResponseDto('Matrículas obtenidas con éxito', result);
  }

  @Get(':id_matricula')
  async findOne(
    @Param('id_matricula') id_matricula: string,
    @Req() req: Request,
  ) {
    const { user, isAspirante, isPrivileged } = this.getRoleFlags(req);
    if (!isPrivileged && !isAspirante) {
      throw new ForbiddenException('No tienes permisos');
    }
    const matricula = await this.matriculaService.findOne(id_matricula);
    if (!matricula) throw new NotFoundException('Matrícula no encontrada');
    if (isPrivileged) {
      return new SuccessResponseDto('Matrícula obtenida con éxito', matricula);
    }
    if (!user?.id_cliente) throw new ForbiddenException('Cliente no válido');
    const ownerId =
      (matricula as any)?.cliente?.id_cliente ?? (matricula as any)?.id_cliente;

    if (ownerId !== user.id_cliente) {
      throw new ForbiddenException('No tienes permisos para ver esta matrícula');
    }

    return new SuccessResponseDto('Matrícula obtenida con éxito', matricula);
  }

  @Put(':id_matricula')
  async update(
    @Param('id_matricula') id_matricula: string,
    @Body() dto: UpdateMatriculaDto,
    @Req() req: Request,
  ) {
    const { isPrivileged } = this.getRoleFlags(req);
    if (!isPrivileged) {
      throw new ForbiddenException('No tienes permisos');
    }

    const matricula = await this.matriculaService.update(id_matricula, dto);
    if (!matricula) throw new NotFoundException('Matrícula no encontrada');

    return new SuccessResponseDto('Matrícula actualizada con éxito', matricula);
  }

  @Delete(':id_matricula')
  async remove(@Param('id_matricula') id_matricula: string, @Req() req: Request) {
    const { isPrivileged } = this.getRoleFlags(req);
    if (!isPrivileged) {
      throw new ForbiddenException('No tienes permisos');
    }

    const matricula = await this.matriculaService.remove(id_matricula);
    if (!matricula) throw new NotFoundException('Matrícula no encontrada');

    return new SuccessResponseDto('Matrícula eliminada con éxito', matricula);
  }
}
