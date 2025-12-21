import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { Usuario } from './entities/usuario.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async create(@Body() dto: CreateUsuarioDto) {
    const usuario = await this.usuarioService.create(dto);

    if (!usuario)
      throw new InternalServerErrorException(
        'No se pudo crear el usuario',
      );

    return new SuccessResponseDto('Usuario creado con éxito', usuario);
  }

  @Get()
  async findAll(): Promise<SuccessResponseDto<Usuario[]>> {
    const usuarios = await this.usuarioService.findAll();
    return new SuccessResponseDto(
      'Usuarios obtenidos con éxito',
      usuarios,
    );
  }

  @Get(':id_usuario')
  async findOne(@Param('id_usuario') id_usuario: string) {
    const usuario = await this.usuarioService.findOne(id_usuario);

    if (!usuario)
      throw new NotFoundException('Usuario no encontrado');

    return new SuccessResponseDto(
      'Usuario obtenido con éxito',
      usuario,
    );
  }

  @Put(':id_usuario')
  async update(
    @Param('id_usuario') id_usuario: string,
    @Body() dto: UpdateUsuarioDto,
  ) {
    const usuario = await this.usuarioService.update(id_usuario, dto);

    if (!usuario)
      throw new NotFoundException('Usuario no encontrado');

    return new SuccessResponseDto(
      'Usuario actualizado con éxito',
      usuario,
    );
  }

  @Delete(':id_usuario')
  async remove(@Param('id_usuario') id_usuario: string) {
    const usuario = await this.usuarioService.remove(id_usuario);

    if (!usuario)
      throw new NotFoundException('Usuario no encontrado');

    return new SuccessResponseDto(
      'Usuario eliminado con éxito',
      usuario,
    );
  }
  
@Put(':id_usuario/profile')
@UseInterceptors(FileInterceptor('profile', {
  storage: diskStorage({
    destination: './public/profile',
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      return cb(new BadRequestException('Only JPG or PNG files are allowed'), false);
    }
    cb(null, true);
  }
}))
async uploadProfile(
  @Param('id_usuario') id_usuario: string,
  @UploadedFile() file: Express.Multer.File,
) {
  if (!file) throw new BadRequestException('Profile image is required');
  const user = await this.usuarioService.updateProfile(id_usuario, file.filename);
  return new SuccessResponseDto('Profile image updated', user);
}
}

