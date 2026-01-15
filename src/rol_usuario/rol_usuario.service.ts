import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRolUsuarioDto } from './dto/create-rol_usuario.dto';
import { UpdateRolUsuarioDto } from './dto/update-rol_usuario.dto';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Rol } from 'src/rol/entities/rol.entity';
import { RolUsuario } from './entities/rol_usuario.entity';

@Injectable()
export class RolUsuarioService {
  constructor(
    @InjectRepository(RolUsuario)
    private readonly rolUsuarioRepository: Repository<RolUsuario>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>
  ) {}

  async create(dto: CreateRolUsuarioDto) {
    const usuario = await this.usuarioRepository.findOne({ where: { id_usuario: dto.id_usuario } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const rol = await this.rolRepository.findOne({ where: { id_rol: dto.id_rol } });
    if (!rol) throw new NotFoundException('Rol no encontrado');

    const rolUsuario = this.rolUsuarioRepository.create({ usuario, rol });
    return await this.rolUsuarioRepository.save(rolUsuario);
  }

  async findAll() {
    return await this.rolUsuarioRepository.find({ relations: ['usuario', 'rol'] });
  }

  async findOne(id: string) {
    const rolUsuario = await this.rolUsuarioRepository.findOne({
      where: { id },
      relations: ['usuario', 'rol'],
    });
    if (!rolUsuario) throw new NotFoundException('Relación rol-usuario no encontrada');
    return rolUsuario;
  }

  async update(id: string, dto: UpdateRolUsuarioDto) {
    const rolUsuario = await this.rolUsuarioRepository.findOne({ where: { id } });
    if (!rolUsuario) throw new NotFoundException('Relación rol-usuario no encontrada');

    if (dto.id_usuario) {
      const usuario = await this.usuarioRepository.findOne({ where: { id_usuario: dto.id_usuario } });
      if (!usuario) throw new NotFoundException('Usuario no encontrado');
      rolUsuario.usuario = usuario;
    }

    if (dto.id_rol) {
      const rol = await this.rolRepository.findOne({ where: { id_rol: dto.id_rol } });
      if (!rol) throw new NotFoundException('Rol no encontrado');
      rolUsuario.rol = rol;
    }

    return await this.rolUsuarioRepository.save(rolUsuario);
  }

  async remove(id: string) {
    const rolUsuario = await this.rolUsuarioRepository.findOne({ where: { id } });
    if (!rolUsuario) throw new NotFoundException('Relación rol-usuario no encontrada');
    return await this.rolUsuarioRepository.remove(rolUsuario);
  }
}