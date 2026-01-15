import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Carrera } from 'src/carrera/entities/carrera.entity';

@Entity('matriculas')
export class Matricula {

  @PrimaryGeneratedColumn('uuid')
  id_matricula: string;

  @ManyToOne(() => Cliente, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente;

  @ManyToOne(() => Carrera, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_carrera' })
  carrera: Carrera;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha_matricula: Date;

  @Column({ length: 20, nullable: false })
  periodo_academico: string;

  @Column({ length: 20, default: 'Activa' })
  estado: string; // Activa, Inactiva, Suspendida, Egresado
}
