import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuditoriaDocument = Auditoria & Document;

@Schema({ collection: 'auditoria', timestamps: false })
export class Auditoria {

  @Prop({ required: true })
  usuario: string;

  @Prop()
  modulo?: string;

  @Prop({ required: true })
  accion: string;

  @Prop({ required: true })
  tabla_afectada: string;

  @Prop()
  id_registro_afectado?: string;

  @Prop()
  descripcion_cambio?: string;

  @Prop({ default: Date.now })
  fecha_accion: Date;

  @Prop()
  ip_usuario?: string;

  @Prop()
  terminal?: string;
}

export const AuditoriaSchema = SchemaFactory.createForClass(Auditoria);
