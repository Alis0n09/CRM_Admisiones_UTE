import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Beca } from 'src/beca/entities/beca.entity';

@Entity('requisitos_beca')
export class RequisitoBeca {

  @PrimaryGeneratedColumn('uuid')
  id_requisito: string;

  @ManyToOne(() => Beca, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_beca' })
  beca: Beca;

  @Column({ type: 'text', nullable: false })
  descripcion: string;

  @Column({ type: 'boolean', default: true })
  obligatorio: boolean;
}
