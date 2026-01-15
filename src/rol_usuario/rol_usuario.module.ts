import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolUsuarioService } from './rol_usuario.service';
import { RolUsuarioController } from './rol_usuario.controller';

import { RolUsuario } from './entities/rol_usuario.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Rol } from 'src/rol/entities/rol.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RolUsuario, Usuario, Rol])],
  controllers: [RolUsuarioController],
  providers: [RolUsuarioService],
  exports: [RolUsuarioService],
})
export class RolUsuarioModule {}
