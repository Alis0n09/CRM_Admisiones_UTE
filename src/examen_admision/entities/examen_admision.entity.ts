import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('examenes_admision')
export class ExamenAdmision {
  @PrimaryGeneratedColumn('uuid')
  id_examen: string;

  @Column({ length: 100, nullable: false })
  nombre_examen: string;

  @Column({ type: 'text', nullable: false })
  descripcion: string;

  @Column({ type: 'date', nullable: false })
  fecha_programada: string;

  @Column({ type: 'int', nullable: false })
  duracion_minutos: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: false })
  puntaje_minimo: string;
}
