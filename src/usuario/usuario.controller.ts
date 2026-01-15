import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post('empleado/:id_empleado')
  async createEmpleadoUsuario(
    @Param('id_empleado') id_empleado: string,
    @Body() dto: CreateUsuarioDto,
  ) {
    const usuario = await this.usuarioService.createEmpleadoUsuario(dto, id_empleado);
    return new SuccessResponseDto('Usuario empleado creado con éxito', usuario);
  }

  @Post('cliente/:id_cliente')
  async createClienteUsuario(
    @Param('id_cliente') id_cliente: string,
    @Body() dto: CreateUsuarioDto,
  ) {
    const usuario = await this.usuarioService.createClienteUsuario(dto, id_cliente);
    return new SuccessResponseDto('Usuario cliente creado con éxito', usuario);
  }

  @Get()
  async findAll() {
    const usuarios = await this.usuarioService.findAll();
    return new SuccessResponseDto('Usuarios obtenidos con éxito', usuarios);
  }

  @Get(':id_usuario')
  async findOne(@Param('id_usuario') id_usuario: string) {
    const usuario = await this.usuarioService.findOne(id_usuario);
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return new SuccessResponseDto('Usuario obtenido con éxito', usuario);
  }

  @Put(':id_usuario')
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
