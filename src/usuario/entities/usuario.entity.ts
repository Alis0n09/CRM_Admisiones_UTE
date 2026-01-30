import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Empleado } from 'src/empleado/entities/empleado.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { RolUsuario } from 'src/rol_usuario/entities/rol_usuario.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id_usuario: string;

  @Column({ length: 120, unique: true })
  email: string;

  @Column({ type: 'text' })
  password_hash: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;

  @Column({ nullable: true })
  profile: string;

  @Column({ type: 'uuid', nullable: true })
  id_empleado?: string | null;

  @Column({ type: 'uuid', nullable: true })
  id_cliente?: string | null;

  @Column({ type: 'text', nullable: true })
  token_reset?: string | null;

  @Column({ type: 'timestamp', nullable: true })
  fecha_expiracion_reset?: Date | null;

  @OneToOne(() => Empleado, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_empleado' })
  empleado?: Empleado;

  @OneToOne(() => Cliente, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_cliente' })
  cliente?: Cliente;

  @OneToMany(() => RolUsuario, (rolUsuario) => rolUsuario.usuario, { cascade: true })
  rolUsuarios: RolUsuario[];
}