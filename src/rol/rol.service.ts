import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Rol } from './entities/rol.entity';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';

@Injectable()
export class RolService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}


  async create(createRolDto: CreateRolDto): Promise<Rol> {
    const { nombre } = createRolDto;

    
    const existe = await this.rolRepository.findOne({
      where: { nombre },
    });

    if (existe) {
      throw new BadRequestException(
        `El rol ${nombre} ya existe`,
      );
    }

    const rol = this.rolRepository.create(createRolDto);
    return await this.rolRepository.save(rol);
  }


  async findAll(): Promise<Rol[]> {
    return await this.rolRepository.find();
  }


  async findOne(id_rol: string): Promise<Rol | null> {
    return await this.rolRepository.findOne({
      where: { id_rol },
    });
  }


  async update(
    id_rol: string,
    updateRolDto: UpdateRolDto,
  ): Promise<Rol | null> {
    const rol = await this.rolRepository.findOne({
      where: { id_rol },
    });

    if (!rol) return null;

    Object.assign(rol, updateRolDto);
    return await this.rolRepository.save(rol);
  }


  async remove(id_rol: string): Promise<Rol | null> {
    const rol = await this.rolRepository.findOne({
      where: { id_rol },
    });

    if (!rol) return null;

    return await this.rolRepository.remove(rol);
  }
}
