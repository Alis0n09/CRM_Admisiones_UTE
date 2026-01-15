import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Empleado } from 'src/empleado/entities/empleado.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity';

@Entity('tareas_crm')
export class TareaCrm {

  @PrimaryGeneratedColumn('uuid')
  id_tarea: string;

  @ManyToOne(() => Empleado, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_empleado' })
  empleado: Empleado;

  @ManyToOne(() => Cliente, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'date', nullable: true })
  fecha_asignacion: Date;

  @Column({ type: 'date', nullable: true })
  fecha_vencimiento: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  estado: string;
}
