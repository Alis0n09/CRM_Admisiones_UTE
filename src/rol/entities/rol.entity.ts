import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RolUsuario } from 'src/rol_usuario/entities/rol_usuario.entity';

@Entity('roles')
export class Rol {
  @PrimaryGeneratedColumn('uuid')
  id_rol: string;

  @Column({ length: 50, unique: true })
  nombre: string;

  @OneToMany(() => RolUsuario, (rolUsuario) => rolUsuario.rol, { cascade: true })
  rolUsuarios: RolUsuario[];
}