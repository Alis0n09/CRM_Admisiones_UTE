import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TareaCrm } from 'src/tarea_crm/entities/tarea_crm.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id_cliente: string;

  @Column({ length: 100, nullable: false })
  nombres: string;

  @Column({ length: 100, nullable: false })
  apellidos: string;

  @Column({ length: 20, nullable: false })
  tipo_identificacion: string;

  @Column({ length: 20, unique: true, nullable: false })
  numero_identificacion: string;

  @Column({ length: 120, nullable: true })
  correo: string;

  @Column({ length: 20, nullable: true })
  telefono: string;

  @Column({ length: 20, nullable: true })
  celular: string;

  @Column({ length: 150, nullable: true })
  calle_principal: string;

  @Column({ length: 150, nullable: true })
  calle_secundaria: string;

  @Column({ length: 20, nullable: true })
  numero_casa: string;

  @Column({ length: 50, nullable: true })
  nacionalidad: string;

  @Column({ type: 'char', length: 1, nullable: true })
  genero: string;

  @Column({ length: 30, nullable: true })
  estado_civil: string;

  @Column({ type: 'date', nullable: true })
  fecha_nacimiento: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_registro: Date;

  @Column({ length: 200, nullable: false })
  origen: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha_cliente: Date;

  @Column({ length: 30, default: 'Nuevo' })
  estado: string;

  @OneToMany(() => TareaCrm, (tarea) => tarea.cliente)
  tareas: TareaCrm[];
}
