import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Aspirante } from 'src/aspirante/entities/aspirante.entity';
import { Carrera } from 'src/carrera/entities/carrera.entity';

@Entity('postulaciones')
export class Postulacion {

  @PrimaryGeneratedColumn('uuid')
  id_postulacion: string;

  @ManyToOne(() => Aspirante, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_aspirante' })
  aspirante: Aspirante;

  @ManyToOne(() => Carrera, { nullable: false })
  @JoinColumn({ name: 'id_carrera' })
  carrera: Carrera;

  @Column({ length: 20 })
  periodo_academico: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha_postulacion: Date;

  @Column({ length: 20, default: 'Pendiente' })
  estado_postulacion: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;
}
