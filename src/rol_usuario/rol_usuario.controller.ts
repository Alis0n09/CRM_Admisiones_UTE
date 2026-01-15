import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { RolUsuarioService } from './rol_usuario.service';
import { CreateRolUsuarioDto } from './dto/create-rol_usuario.dto';
import { UpdateRolUsuarioDto } from './dto/update-rol_usuario.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('rol-usuario')
export class RolUsuarioController {
  constructor(private readonly rolUsuarioService: RolUsuarioService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Post()
  async create(@Body() dto: CreateRolUsuarioDto) {
    const rolUsuario = await this.rolUsuarioService.create(dto);
    return new SuccessResponseDto('Rol asignado al usuario con éxito', rolUsuario);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Get()
  async findAll() {
    const relaciones = await this.rolUsuarioService.findAll();
    return new SuccessResponseDto('Relaciones rol-usuario obtenidas con éxito', relaciones);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const rolUsuario = await this.rolUsuarioService.findOne(id);
    if (!rolUsuario) throw new NotFoundException('Relación rol-usuario no encontrada');
    return new SuccessResponseDto('Relación rol-usuario obtenida con éxito', rolUsuario);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateRolUsuarioDto) {
    const rolUsuario = await this.rolUsuarioService.update(id, dto);
    return new SuccessResponseDto('Relación rol-usuario actualizada con éxito', rolUsuario);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const rolUsuario = await this.rolUsuarioService.remove(id);
    return new SuccessResponseDto('Relación rol-usuario eliminada con éxito', rolUsuario);
  }
}