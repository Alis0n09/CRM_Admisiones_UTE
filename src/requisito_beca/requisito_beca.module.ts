import { Module } from '@nestjs/common';
import { RequisitoBecaService } from './requisito_beca.service';
import { RequisitoBecaController } from './requisito_beca.controller';
import { RequisitoBeca } from './entities/requisito_beca.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RequisitoBeca])],
  controllers: [RequisitoBecaController],
  providers: [RequisitoBecaService],
})
export class RequisitoBecaModule {}
