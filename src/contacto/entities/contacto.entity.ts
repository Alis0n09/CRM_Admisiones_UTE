import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TareaCrm } from 'src/tarea_crm/entities/tarea_crm.entity';
@Entity('contactos')
export class Contacto {
  @PrimaryGeneratedColumn('uuid')
  id_contacto: string;

  @Column({ length: 100, nullable: false })
  nombres: string;

  @Column({ length: 100, nullable: false })
  apellidos: string;

  @Column({ length: 20, nullable: false })
  tipo_identificacion: string;

  @Column({ length: 20, unique: true })
  numero_identificacion: string;

  @Column({ length: 120, nullable: true })
  correo: string;

  @Column({ length: 20, nullable: true })
  telefono: string;

  @Column({ length: 20, nullable: true })
  celular: string;

  @Column({ length: 150, nullable: true })
  calle_principal: string;

  @Column({ length: 150, nullable: true })
  calle_secundaria: string;

  @Column({ length: 20, nullable: true })
  numero_casa: string;

  @Column({ length: 50 })
  origen: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha_contacto: Date;

  @Column({ length: 30, default: 'Nuevo' })
  estado: string;

  @OneToMany(() => TareaCrm, (tarea) => tarea.contacto)
  tareas: TareaCrm[]
}