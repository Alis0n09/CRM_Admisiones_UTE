import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('becas')
export class Beca {

  @PrimaryGeneratedColumn('uuid')
  id_beca: string;

  @Column({ length: 150, nullable: false })
  nombre_beca: string;

  @Column({ length: 100, nullable: false })
  tipo_beca: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: false,
  })
  porcentaje_cobertura: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  monto_maximo: number;

  @Column({ type: 'date', nullable: false })
  fecha_inicio: Date;

  @Column({ type: 'date', nullable: true })
  fecha_fin: Date;

  @Column({ length: 20, default: 'Activa' })
  estado: string;
}
