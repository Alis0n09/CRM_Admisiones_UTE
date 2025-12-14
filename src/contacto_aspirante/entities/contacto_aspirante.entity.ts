import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Contacto } from 'src/contacto/entities/contacto.entity'; 
import { Aspirante } from 'src/aspirante/entities/aspirante.entity'; 

@Entity('contacto_aspirante')
export class ContactoAspirante {
  @PrimaryGeneratedColumn('uuid')
  id_contacto_aspirante: string;

  @Column({ type: 'uuid', nullable: false })
  id_contacto: string;

  @Column({ type: 'uuid', nullable: false })
  id_aspirante: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha_vinculo: Date;

  @Column({ length: 50 })
  origen: string;

 
  @ManyToOne(() => Contacto, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_contacto' })
  contacto: Contacto;


  @ManyToOne(() => Aspirante, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_aspirante' })
  aspirante: Aspirante;
}
