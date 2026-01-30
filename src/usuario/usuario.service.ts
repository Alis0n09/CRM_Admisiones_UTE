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
    try {
      const normalizedEmail = (email ?? '').trim().toLowerCase();
      
      const usuario = await this.usuarioRepository
        .createQueryBuilder('usuario')
        .leftJoinAndSelect('usuario.empleado', 'empleado')
        .leftJoinAndSelect('usuario.cliente', 'cliente')
        .leftJoinAndSelect('usuario.rolUsuarios', 'rolUsuarios')
        .leftJoinAndSelect('rolUsuarios.rol', 'rol')
        .where('LOWER(usuario.email) = LOWER(:email)', { email: normalizedEmail })
        .getOne();

      return usuario;
    } catch (error) {
      return null;
    }
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
      relations: ['rolUsuarios'],
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const payload: Record<string, unknown> = { ...dto };
    const rolesIds: string[] | undefined = Array.isArray(payload.rolesIds) 
      ? (payload.rolesIds as string[]) 
      : undefined;
    delete payload.rolesIds;

    if (payload.password != null && payload.password !== '') {
      (payload as any).password_hash = await bcrypt.hash(
        String(payload.password),
        10,
      );
    }
    delete payload.password;

    const toUpdate: Record<string, unknown> = {};
    const allowed = ['email', 'activo', 'password_hash'];
    for (const k of allowed) {
      if ((payload as any)[k] !== undefined) {
        toUpdate[k] = (payload as any)[k];
      }
    }

    if (Object.keys(toUpdate).length > 0) {
      await this.usuarioRepository.update({ id_usuario }, toUpdate);
    }

    if (rolesIds !== undefined) {
      const usuarioConRoles = await this.usuarioRepository.findOne({
        where: { id_usuario },
        relations: ['rolUsuarios'],
      });
      if (usuarioConRoles && usuarioConRoles.rolUsuarios && usuarioConRoles.rolUsuarios.length > 0) {
        await this.rolUsuarioRepository.remove(usuarioConRoles.rolUsuarios);
      }
      if (rolesIds && rolesIds.length > 0) {
        const usuarioActualizado = await this.usuarioRepository.findOne({
          where: { id_usuario },
        });
        if (usuarioActualizado) {
          await this.asignarRoles(usuarioActualizado, rolesIds);
        }
      }
    }

    return this.findOne(id_usuario);
  }

  async remove(id_usuario: string) {
    const user = await this.findOne(id_usuario);
    if (!user) return null;
    await this.usuarioRepository.delete({ id_usuario });
    return user;
  }

  async updateResetToken(email: string, token: string, fechaExpiracion: Date) {
    const normalizedEmail = (email ?? '').trim().toLowerCase();
    await this.usuarioRepository.update(
      { email: normalizedEmail },
      { token_reset: token, fecha_expiracion_reset: fechaExpiracion }
    );
  }

  async findByResetToken(token: string): Promise<Usuario | null> {
    try {
      return await this.usuarioRepository.findOne({
        where: { token_reset: token },
        relations: ['empleado', 'cliente', 'rolUsuarios', 'rolUsuarios.rol'],
      });
    } catch (error) {
      return null;
    }
  }

  async clearResetToken(id_usuario: string) {
    await this.usuarioRepository.update(
      { id_usuario },
      { token_reset: null, fecha_expiracion_reset: null }
    );
  }
}
