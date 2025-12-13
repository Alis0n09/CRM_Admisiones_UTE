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

  @ManyToOne(() => Asesor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_asesor' })
  asesor: Asesor;

  @ManyToOne(() => Contacto, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_contacto' })
  contacto: Contacto;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'date', nullable: true })
  fecha_asignacion: Date;

  @Column({ type: 'date', nullable: true })
  fecha_vencimiento: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  estado: string;
}
