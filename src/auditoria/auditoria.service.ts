import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auditoria, AuditoriaDocument } from './entities/auditoria.schema';

@Injectable()
export class AuditoriaService {
  constructor(
    @InjectModel(Auditoria.name)
    private readonly auditoriaModel: Model<AuditoriaDocument>,
  ) {}

  // ======================
  // CREATE
  // ======================
  async create(data: Partial<Auditoria>): Promise<Auditoria> {
    const auditoria = new this.auditoriaModel({
      ...data,
      fecha_accion: data.fecha_accion ?? new Date(),
    });

    return await auditoria.save();
  }

  // ======================
  // FIND ALL (con filtros opcionales)
  // ======================
  async findAll(filters?: {
    usuario?: string;
    modulo?: string;
    accion?: string;
    tabla_afectada?: string;
    desde?: string; // ISO date string
    hasta?: string; // ISO date string
  }): Promise<Auditoria[]> {
    const query: any = {};

    if (filters?.usuario) query.usuario = filters.usuario;
    if (filters?.modulo) query.modulo = filters.modulo;
    if (filters?.accion) query.accion = filters.accion;
    if (filters?.tabla_afectada) query.tabla_afectada = filters.tabla_afectada;

    // rango de fechas
    if (filters?.desde || filters?.hasta) {
      query.fecha_accion = {};
      if (filters.desde) query.fecha_accion.$gte = new Date(filters.desde);
      if (filters.hasta) query.fecha_accion.$lte = new Date(filters.hasta);
    }

    return await this.auditoriaModel
      .find(query)
      .sort({ fecha_accion: -1 })
      .exec();
  }


  async findOne(id: string): Promise<Auditoria | null> {
    return await this.auditoriaModel.findById(id).exec();
  }


  async remove(id: string): Promise<Auditoria | null> {
    return await this.auditoriaModel.findByIdAndDelete(id).exec();
  }
}
