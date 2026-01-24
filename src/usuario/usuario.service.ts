import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { RolUsuario } from 'src/rol_usuario/entities/rol_usuario.entity';
import { Rol } from 'src/rol/entities/rol.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(RolUsuario)
    private readonly rolUsuarioRepository: Repository<RolUsuario>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async createEmpleadoUsuario(dto: CreateUsuarioDto, id_empleado: string) {
    const password_hash = await bcrypt.hash(dto.password, 10);

    const usuario = this.usuarioRepository.create({
      email: dto.email,
      password_hash,
      activo: true,
      id_empleado,
      id_cliente: null,
    });

    const saved = await this.usuarioRepository.save(usuario);
    await this.asignarRoles(saved, dto.rolesIds);
    return saved;
  }

  async createClienteUsuario(dto: CreateUsuarioDto, id_cliente: string) {
    const password_hash = await bcrypt.hash(dto.password, 10);

    const usuario = this.usuarioRepository.create({
      email: dto.email,
      password_hash,
      activo: true,
      id_cliente,
      id_empleado: null,
    });

    const saved = await this.usuarioRepository.save(usuario);
    await this.asignarRoles(saved, dto.rolesIds);
    return saved;
  }

  private async asignarRoles(usuario: Usuario, rolesIds?: string[]) {
    if (rolesIds && rolesIds.length > 0) {
      const rolUsuarios = rolesIds.map((idRol) => {
        const ru = new RolUsuario();
        ru.usuario = usuario;
        ru.rol = { id_rol: idRol } as Rol;
        return ru;
      });
      await this.rolUsuarioRepository.save(rolUsuarios);
    }
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const usuario = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.empleado', 'empleado')
      .leftJoinAndSelect('usuario.cliente', 'cliente')
      .leftJoinAndSelect('usuario.rolUsuarios', 'rolUsuarios')
      .leftJoinAndSelect('rolUsuarios.rol', 'rol')
      .where('usuario.email = :email', { email })
      .getOne();

    return usuario;
  }

  async findAll() {
    return await this.usuarioRepository.find({
      relations: ['empleado', 'cliente', 'rolUsuarios', 'rolUsuarios.rol'],
    });
  }

  async findOne(id_usuario: string) {
    return await this.usuarioRepository.findOne({
      where: { id_usuario },
      relations: ['empleado', 'cliente', 'rolUsuarios', 'rolUsuarios.rol'],
    });
  }

  async update(id_usuario: string, dto: any) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario },
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const payload: any = { ...dto };

    if (payload.password) {
      payload.password_hash = await bcrypt.hash(payload.password, 10);
      delete payload.password;
    }

    if (payload.rolesIds) {
      delete payload.rolesIds;
    }

    await this.usuarioRepository.update({ id_usuario }, payload);
    return this.findOne(id_usuario);
  }

  async remove(id_usuario: string) {
    const user = await this.findOne(id_usuario);
    if (!user) return null;
    await this.usuarioRepository.delete({ id_usuario });
    return user;
  }
}
