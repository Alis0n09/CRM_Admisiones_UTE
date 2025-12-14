import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
} from 'typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Entity('roles')
export class Rol {

  @PrimaryGeneratedColumn('uuid')
  id_rol: string;

  @Column({ length: 30, unique: true })
  nombre: string; // ADMIN, ASESOR, ASPIRANTE

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @ManyToMany(() => Usuario, (usuario) => usuario.roles)
  usuarios: Usuario[];
}
