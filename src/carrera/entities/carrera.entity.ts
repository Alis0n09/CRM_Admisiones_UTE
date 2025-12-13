import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('carreras')
export class Carrera {
  @PrimaryGeneratedColumn('uuid')
  id_carrera: string;

  @Column({ length: 150, nullable: false })
  nombre_carrera: string;

  @Column({ length: 100, nullable: false })
  facultad: string;

  @Column({ type: 'int', nullable: false })
  duracion_semestres: number;

  @Column({ length: 50, nullable: false })
  nivel_grado: string; 

  @Column({ type: 'int', nullable: false })
  cupos_disponibles: number;

  @Column({ length: 1, default: '1' })
  estado: string; 
}
