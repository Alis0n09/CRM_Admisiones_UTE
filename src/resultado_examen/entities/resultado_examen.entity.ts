import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Postulacion } from 'src/postulacion/entities/postulacion.entity';
import { ExamenAdmision } from '../../examen_admision/entities/examen_admision.entity';
@Entity('resultados_examen')
export class ResultadoExamen {
  @PrimaryGeneratedColumn('uuid')
  id_resultado: string;

  @ManyToOne(() => Postulacion, { nullable: false, onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'id_postulacion' })
  postulacion: Postulacion;

  @ManyToOne(() => ExamenAdmision, { nullable: false, onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'id_examen' })
  examen: ExamenAdmision;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: false })
  puntaje_obtenido: number;

  @Column({ type: 'date', nullable: false })
  fecha_resultado: Date;
}
