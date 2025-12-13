import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
} from 'typeorm';
import { Contacto } from 'src/contacto/entities/contacto.entity';

@Entity('seguimientos')
export class Seguimiento {
  @PrimaryGeneratedColumn('uuid')
  id_seguimiento: string;

  @ManyToOne(() => Contacto, { onDelete: 'CASCADE'})
  @JoinColumn({ name: 'id_contacto' }) 
  contacto: Contacto;

  @Column({ type: 'date', nullable: true })
  fecha_contacto: Date;

  @Column({ length: 50, nullable: true })
  medio: string;

  @Column({ type: 'text', nullable: true })
  comentarios: string;

  @Column({ type: 'text', nullable: true })
  proximo_paso: string;

  @Column({ type: 'date', nullable: true })
  fecha_proximo_contacto: Date;
}


