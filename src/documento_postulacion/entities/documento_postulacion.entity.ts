import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Postulacion } from '../../postulacion/entities/postulacion.entity';

@Entity('documentos_postulacion')
export class DocumentosPostulacion {
  @PrimaryGeneratedColumn('uuid')
  id_documento: string;

  @ManyToOne(() => Postulacion, { nullable: false })
  @JoinColumn({ name: 'id_postulacion' })
  postulacion: Postulacion;

  @Column({ type: 'varchar', length: 80 })
  tipo_documento: string; 

  @Column({ type: 'varchar', length: 200 })
  nombre_archivo: string;

  @Column({ type: 'varchar', length: 500 })
  url_archivo: string; 

  @Column({ type: 'varchar', length: 30, default: 'Pendiente' })
  estado_documento: string;

  @Column({ type: 'text', nullable: true })
  observaciones?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
