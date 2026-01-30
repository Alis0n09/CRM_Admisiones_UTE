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
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { Usuario } from './entities/usuario.entity';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('usuario')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post('empleado/:id_empleado')
  @Roles('ADMIN')
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
  @Roles('ADMIN')
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
  @Roles('ADMIN')
  async findAll(@Query() query: QueryDto): Promise<SuccessResponseDto<Usuario[]>> {
    const result: Usuario[] = await this.usuarioService.findAll(); // <-- sin pasar query
    if (!result)
      throw new InternalServerErrorException('No se pudieron obtener los usuarios');

    return new SuccessResponseDto('Usuarios obtenidos con éxito', result);
  }

  @Get(':id_usuario')
  @Roles('ADMIN')
  async findOne(@Param('id_usuario') id_usuario: string) {
    const usuario = await this.usuarioService.findOne(id_usuario);
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return new SuccessResponseDto('Usuario obtenido con éxito', usuario);
  }

  @Put(':id_usuario')
  @Patch(':id_usuario')
  @Roles('ADMIN')
  async update(
    @Param('id_usuario') id_usuario: string,
    @Body() dto: UpdateUsuarioDto,
  ) {
    const usuario = await this.usuarioService.update(id_usuario, dto);
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return new SuccessResponseDto('Usuario actualizado con éxito', usuario);
  }

  @Delete(':id_usuario')
  @Roles('ADMIN')
  async remove(@Param('id_usuario') id_usuario: string) {
    const eliminado = await this.usuarioService.remove(id_usuario);
    if (!eliminado) throw new NotFoundException('Usuario no encontrado');
    return new SuccessResponseDto('Usuario eliminado con éxito', eliminado);
  }
}
