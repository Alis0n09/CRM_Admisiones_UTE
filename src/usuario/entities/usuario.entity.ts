import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Rol } from 'src/rol/entities/rol.entity';
import { Asesor } from 'src/asesor/entities/asesor.entity';
import { Aspirante } from 'src/aspirante/entities/aspirante.entity';

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

  // Roles (tabla intermedia usuario_roles)
  @ManyToMany(() => Rol, (rol) => rol.usuarios, { eager: true })
  @JoinTable({
    name: 'usuario_roles',
    joinColumn: { name: 'id_usuario', referencedColumnName: 'id_usuario' },
    inverseJoinColumn: { name: 'id_rol', referencedColumnName: 'id_rol' },
  })
  roles: Rol[];

  // Perfil ASESOR (si este usuario es asesor)
  @OneToOne(() => Asesor, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_asesor' })
  asesor?: Asesor;

  // Perfil ASPIRANTE (si este usuario es aspirante)
  @OneToOne(() => Aspirante, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_aspirante' })
  aspirante?: Aspirante;
}
