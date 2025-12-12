import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('asesores')
export class Asesor {
  @PrimaryGeneratedColumn()
  id_asesor: string;

  @Column({ length: 100 })
  nombres: string;

  @Column({ length: 100 })
  apellidos: string;

  @Column({ length: 20 })
  tipo_identificacion: string;

  @Column({ length: 20, unique: true })
  numero_identificacion: string;

  @Column({ length: 120, nullable: true })
  correo: string;

  @Column({ length: 20, nullable: true })
  telefono: string;

  @Column({ length: 50, nullable: true })
  departamento: string;
}
