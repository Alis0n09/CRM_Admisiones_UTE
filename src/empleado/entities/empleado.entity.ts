import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TareaCrm } from 'src/tarea_crm/entities/tarea_crm.entity';

@Entity('empleados')
export class Empleado {
  @PrimaryGeneratedColumn('uuid')
  id_empleado: string;

  @Column({ length: 100 })
  nombres: string;

  @Column({ length: 100 })
  apellidos: string;

  @Column({ length: 20 })
  tipo_identificacion: string;

  @Column({ length: 20, unique: true })
  numero_identificacion: string;

  @Column({ length: 120, nullable: true })
  correo: string;

  @Column({ length: 20, nullable: true })
  telefono: string;

  @Column({ length: 50, nullable: true })
  departamento: string;

  @OneToMany(() => TareaCrm, (tarea) => tarea.empleado)
  tareas: TareaCrm[];
}
