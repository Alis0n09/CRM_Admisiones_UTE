import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { Rol } from 'src/rol/entities/rol.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    @InjectRepository(Rol)
    private readonly roleRepository: Repository<Rol>,
  ) {}

  // ======================
  // CREATE USUARIO
  // ======================
  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const {
      email,
      password,
      id_rol,
      id_asesor,
      id_aspirante,
    } = createUsuarioDto;

    // ❌ Validación lógica
    if (id_asesor && id_aspirante) {
      throw new BadRequestException(
        'Un usuario no puede ser asesor y aspirante al mismo tiempo',
      );
    }

    // 🔎 Verificar rol
    const rol = await this.roleRepository.findOne({
      where: { id_rol },
    });

    if (!rol) {
      throw new BadRequestException('Rol no válido');
    }

    // 🔐 Hash del password
    const password_hash = await bcrypt.hash(password, 10);

    // 🧱 Crear usuario
    const usuario = this.usuarioRepository.create({
      email,
      password_hash,
      asesor: id_asesor ? ({ id_asesor } as any) : null,
      aspirante: id_aspirante ? ({ id_aspirante } as any) : null,
      roles: [rol],
    });

    return await this.usuarioRepository.save(usuario);
  }


  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find({
      relations: ['asesor', 'aspirante'],
    });
  }


  async findOne(id_usuario: string): Promise<Usuario | null> {
    return await this.usuarioRepository.findOne({
      where: { id_usuario },
      relations: ['asesor', 'aspirante'],
    });
  }


  async update(
    id_usuario: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario | null> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario },
      relations: ['roles'],
    });

    if (!usuario) return null;

    // Si actualiza password
    if (updateUsuarioDto.password) {
      usuario.password_hash = await bcrypt.hash(
        updateUsuarioDto.password,
        10,
      );
      delete updateUsuarioDto.password;
    }

    Object.assign(usuario, updateUsuarioDto as any);

    return await this.usuarioRepository.save(usuario);
  }


  async remove(id_usuario: string): Promise<Usuario | null> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario },
    });

    if (!usuario) return null;

    return await this.usuarioRepository.remove(usuario);
  }
}
