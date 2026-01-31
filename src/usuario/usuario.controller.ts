import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  NotFoundException,
  InternalServerErrorException,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { Usuario } from './entities/usuario.entity';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

// TEMPORAL: Sin RolesGuard ni @Roles('ADMIN') para poder crear el primer admin logueado con cualquier usuario. Restaurar cuando ya exista un admin.
@Controller('usuario')
@UseGuards(JwtAuthGuard)
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  /** Crea el primer admin (solo si aún no hay ninguno). Cualquier usuario logueado puede llamarlo. */
  @Post('crear-primer-admin')
  async crearPrimerAdmin(@Body() body: { email: string; password: string }) {
    const email = body?.email?.trim();
    const password = body?.password;
    if (!email) throw new BadRequestException('El campo email es requerido');
    if (!password || String(password).length < 6) {
      throw new BadRequestException('El password es requerido y debe tener al menos 6 caracteres');
    }
    const usuario = await this.usuarioService.createFirstAdmin(email, password);
    return new SuccessResponseDto('Administrador creado con éxito', usuario);
  }

  @Post('empleado/:id_empleado')
  async createEmpleadoUsuario(
    @Param('id_empleado') id_empleado: string,
    @Body() dto: CreateUsuarioDto,
  ) {
    const usuario = await this.usuarioService.createEmpleadoUsuario(dto, id_empleado);
    if (!usuario)
      throw new InternalServerErrorException('No se pudo crear el usuario empleado');
    return new SuccessResponseDto('Usuario empleado creado con éxito', usuario);
  }

  @Post('cliente/:id_cliente')
  async createClienteUsuario(
    @Param('id_cliente') id_cliente: string,
    @Body() dto: CreateUsuarioDto,
  ) {
    const usuario = await this.usuarioService.createClienteUsuario(dto, id_cliente);
    if (!usuario)
      throw new InternalServerErrorException('No se pudo crear el usuario cliente');
    return new SuccessResponseDto('Usuario cliente creado con éxito', usuario);
  }

  @Get()
  async findAll(@Query() query: QueryDto): Promise<SuccessResponseDto<Usuario[]>> {
    const result: Usuario[] = await this.usuarioService.findAll(); // <-- sin pasar query
    if (!result)
      throw new InternalServerErrorException('No se pudieron obtener los usuarios');

    return new SuccessResponseDto('Usuarios obtenidos con éxito', result);
  }

  @Get(':id_usuario')
  async findOne(@Param('id_usuario') id_usuario: string) {
    const usuario = await this.usuarioService.findOne(id_usuario);
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return new SuccessResponseDto('Usuario obtenido con éxito', usuario);
  }

  @Put(':id_usuario')
  @Patch(':id_usuario')
  async update(
    @Param('id_usuario') id_usuario: string,
    @Body() dto: UpdateUsuarioDto,
  ) {
    const usuario = await this.usuarioService.update(id_usuario, dto);
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return new SuccessResponseDto('Usuario actualizado con éxito', usuario);
  }

  @Delete(':id_usuario')
  async remove(@Param('id_usuario') id_usuario: string) {
    const eliminado = await this.usuarioService.remove(id_usuario);
    if (!eliminado) throw new NotFoundException('Usuario no encontrado');
    return new SuccessResponseDto('Usuario eliminado con éxito', eliminado);
  }
}
