import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';

import { ContactoAspiranteService } from './contacto_aspirante.service';
import { CreateContactoAspiranteDto } from './dto/create-contacto_aspirante.dto';
import { UpdateContactoAspiranteDto } from './dto/update-contacto_aspirante.dto';

import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { ContactoAspirante } from './entities/contacto_aspirante.entity';

@Controller('contacto-aspirante')
export class ContactoAspiranteController {
  constructor(
    private readonly contactoAspiranteService: ContactoAspiranteService,
  ) {}

  @Post()
  async create(@Body() dto: CreateContactoAspiranteDto) {
    try {
      const contactoAspirante = await this.contactoAspiranteService.create(dto);
      return new SuccessResponseDto(
        'Vínculo contacto-aspirante creado con éxito',
        contactoAspirante,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'No se pudo crear el vínculo contacto-aspirante',
      );
    }
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<ContactoAspirante>>> {
    if (query.limit && query.limit > 100) {
      query.limit = 100;
    }

    const result = await this.contactoAspiranteService.findAll(query);

    if (!result) {
      throw new InternalServerErrorException(
        'No se pudieron obtener los vínculos contacto-aspirante',
      );
    }

    return new SuccessResponseDto(
      'Vínculos contacto-aspirante obtenidos con éxito',
      result,
    );
  }

  @Get(':id_contacto_aspirante')
  async findOne(
    @Param('id_contacto_aspirante') id_contacto_aspirante: string,
  ) {
    const contactoAspirante =
      await this.contactoAspiranteService.findOne(id_contacto_aspirante);

    if (!contactoAspirante) {
      throw new NotFoundException('Vínculo contacto-aspirante no encontrado');
    }

    return new SuccessResponseDto(
      'Vínculo contacto-aspirante obtenido con éxito',
      contactoAspirante,
    );
  }

  @Put(':id_contacto_aspirante')
  async update(
    @Param('id_contacto_aspirante') id_contacto_aspirante: string,
    @Body() dto: UpdateContactoAspiranteDto,
  ) {
    const contactoAspirante =
      await this.contactoAspiranteService.update(id_contacto_aspirante, dto);

    if (!contactoAspirante) {
      throw new NotFoundException('Vínculo contacto-aspirante no registrado');
    }

    return new SuccessResponseDto(
      'Vínculo contacto-aspirante actualizado con éxito',
      contactoAspirante,
    );
  }

  @Delete(':id_contacto_aspirante')
  async remove(
    @Param('id_contacto_aspirante') id_contacto_aspirante: string,
  ) {

    
    const contactoAspirante =
      await this.contactoAspiranteService.findOne(id_contacto_aspirante);

    if (!contactoAspirante) {
      throw new NotFoundException('Vínculo contacto-aspirante no encontrado');
    }

    await this.contactoAspiranteService.remove(id_contacto_aspirante);

  
    return new SuccessResponseDto(
      'Vínculo contacto-aspirante eliminado con éxito',
      contactoAspirante,
    );
  }
}
