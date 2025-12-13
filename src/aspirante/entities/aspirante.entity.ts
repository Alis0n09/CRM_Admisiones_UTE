import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Contacto } from 'src/contacto/entities/contacto.entity';

@Entity('aspirantes')
export class Aspirante {

  @PrimaryGeneratedColumn('uuid')
  id_aspirante: string;

  @ManyToOne(() => Contacto, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_contacto' })
  contacto: Contacto;

  @Column({ length: 50, nullable: true })
  nacionalidad: string;

  @Column({ type: 'char', length: 1, nullable: true })
  genero: string;

  @Column({ length: 30, nullable: true })
  estado_civil: string;

  @Column({ type: 'date', nullable: true })
  fecha_nacimiento: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_registro: Date;
}
