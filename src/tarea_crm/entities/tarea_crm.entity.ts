import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Asesor } from 'src/asesor/entities/asesor.entity';
import { Contacto } from 'src/contacto/entities/contacto.entity';

@Entity('tareas_crm')
export class TareaCrm {
 
  @PrimaryGeneratedColumn('uuid')
  id_tarea: string;
 
  @ManyToOne(() => Asesor, (asesor) => asesor.tareas, { eager: true })
  @JoinColumn({ name: 'id_asesor' })
  asesor: Asesor;

  @ManyToOne(() => Contacto, (contacto) => contacto.tareas, { eager: true })
  @JoinColumn({ name: 'id_contacto' })
  contacto: Contacto;

  @Column('text')
  descripcion: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha_asignacion: string;

  @Column({ type: 'date', nullable: true })
  fecha_vencimiento: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'Pendiente',
    comment: 'Pendiente, En progreso, Completada',
  })
  estado: string;
}