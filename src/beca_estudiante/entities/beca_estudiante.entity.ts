import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Beca } from 'src/beca/entities/beca.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity';

@Entity('becas_estudiantes')
export class BecaEstudiante {
  @PrimaryGeneratedColumn('uuid')
  id_beca_estudiante: string;


  @ManyToOne(() => Beca, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_beca' })
  beca: Beca;


  @ManyToOne(() => Cliente, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha_asignacion: Date;

  @Column({ length: 20 })
  periodo_academico: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto_otorgado: string;

  @Column({ length: 20, default: 'Vigente' })
  estado: string;
}
