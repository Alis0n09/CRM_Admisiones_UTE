import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Rol } from 'src/rol/entities/rol.entity';

@Entity('rol_usuario')
export class RolUsuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.rolUsuarios, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ManyToOne(() => Rol, (rol) => rol.rolUsuarios, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_rol' })
  rol: Rol;
}