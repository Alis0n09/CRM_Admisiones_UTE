import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditoriaController } from './auditoria.controller';
import { AuditoriaService } from './auditoria.service';
import { Auditoria, AuditoriaSchema } from './entities/auditoria.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Auditoria.name, schema: AuditoriaSchema },
    ]),
  ],
  controllers: [AuditoriaController],
  providers: [AuditoriaService],
  exports: [AuditoriaService],
})
export class AuditoriaModule {}
