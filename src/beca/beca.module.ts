import { Module } from '@nestjs/common';
import { BecaService } from './beca.service';
import { BecaController } from './beca.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Beca } from './entities/beca.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Beca])],
  controllers: [BecaController],
  providers: [BecaService],
})
export class BecaModule {}
