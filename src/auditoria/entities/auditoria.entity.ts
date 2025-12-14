import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('auditoria')
export class Auditoria {
  @PrimaryGeneratedColumn('uuid')
  id_auditoria: string;

  @Column({ length: 100 })
  usuario: string;

  @Column({ length: 50, nullable: true })
  modulo: string;

  @Column({ length: 20 })
  accion: string;

  @Column({ length: 100 })
  tabla_afectada: string;

  @Column({ type: 'uuid', nullable: true })
  id_registro_afectado: string;

  @Column({ type: 'text', nullable: true })
  descripcion_cambio: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_accion: Date;

  @Column({ length: 45, nullable: true })
  ip_usuario: string;

  @Column({ length: 100, nullable: true })
  terminal: string;
}
