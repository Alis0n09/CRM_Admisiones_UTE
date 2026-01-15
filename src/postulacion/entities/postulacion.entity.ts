import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Carrera } from 'src/carrera/entities/carrera.entity';

@Entity('postulaciones')
export class Postulacion {

  @PrimaryGeneratedColumn('uuid')
  id_postulacion: string;

  @ManyToOne(() => Cliente, { nullable: false, onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente;

  @ManyToOne(() => Carrera, { nullable: false, eager: true })
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
