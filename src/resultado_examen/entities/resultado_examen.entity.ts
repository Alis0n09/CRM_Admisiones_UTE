import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Postulacion } from '../../postulacion/entities/postulacion.entity';
import { ExamenAdmision } from '../../examen_admision/entities/examen_admision.entity';

@Entity('resultado_examen')
export class ResultadoExamen {
  @PrimaryGeneratedColumn('uuid')
  id_resultado: string;

  @ManyToOne(() => Postulacion, { nullable: false })
  @JoinColumn({ name: 'id_postulacion' })
  postulacion: Postulacion;

  @ManyToOne(() => ExamenAdmision, { nullable: false })
  @JoinColumn({ name: 'id_examen' })
  examen: ExamenAdmision;

  @Column('decimal', { precision: 5, scale: 2 })
  puntaje_obtenido: number;

  @Column({ type: 'date' })
  fecha_resultado: Date;
}
