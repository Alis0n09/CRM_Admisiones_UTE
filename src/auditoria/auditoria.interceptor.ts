import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditoriaService } from './auditoria.service';

@Injectable()
export class AuditoriaInterceptor implements NestInterceptor {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest();

    
    const method = (req.method || '').toUpperCase();
    const isWrite = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

    if (!isWrite) return next.handle();

    const user = req.user; 
    const usuario = user?.email ?? user?.id_usuario ?? 'ANONIMO';

    const ip_usuario =
      req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() ||
      req.ip ||
      req.connection?.remoteAddress;

    const terminal = req.headers['user-agent'];

    
    const controllerName = context.getClass().name;     
    const handlerName = context.getHandler().name;      
    const modulo = controllerName.replace('Controller', '');
    const tabla_afectada = req.baseUrl?.replace('/', '') || modulo.toLowerCase();


    const accion =
      method === 'POST'
        ? 'CREAR'
        : method === 'PUT'
        ? 'ACTUALIZAR'
        : method === 'PATCH'
        ? 'ACTUALIZAR_PARCIAL'
        : 'ELIMINAR';

    
    const id_registro_afectado =
      req.params?.id ||
      req.params?.id_beca ||
      req.params?.id_carrera ||
      req.params?.id_cliente ||
      undefined;

    
    const descripcion_cambio = `[${handlerName}] body: ${safeStringify(req.body)}`;

    return next.handle().pipe(
      tap({
        next: async (response) => {
          try {
            
            const idFromResponse = extractIdFromResponse(response);
            const finalId = id_registro_afectado ?? idFromResponse;

            await this.auditoriaService.create({
              usuario,
              modulo,
              accion,
              tabla_afectada,
              id_registro_afectado: finalId,
              descripcion_cambio,
              ip_usuario,
              terminal,
              fecha_accion: new Date(),
            });
          } catch (e) {
            
          }
        },
      }),
    );
  }
}

function safeStringify(obj: any) {
  try {
    if (!obj) return '';
    const clone = { ...obj };
    if ('password' in clone) clone.password = '***';
    if ('password_hash' in clone) clone.password_hash = '***';
    if ('access_token' in clone) clone.access_token = '***';
    return JSON.stringify(clone);
  } catch {
    return '';
  }
}


function extractIdFromResponse(resp: any): string | undefined {
  
  const data = resp?.data ?? resp;

  if (!data || typeof data !== 'object') return undefined;

  
  return (
    data.id ||
    data.id_beca ||
    data.id_carrera ||
    data.id_cliente ||
    data.id_beca_estudiante ||
    data.id_usuario ||
    undefined
  );
}
