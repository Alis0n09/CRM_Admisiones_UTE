import { Module } from '@nestjs/common';
import { TareaCrmService } from './tarea_crm.service';
import { TareaCrmController } from './tarea_crm.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { TareaCrm } from './entities/tarea_crm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TareaCrm])],
  controllers: [TareaCrmController],
  providers: [TareaCrmService],
})
export class TareaCrmModule {}
