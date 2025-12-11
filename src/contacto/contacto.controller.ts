import {Controller, Get, Post, Put, Delete, Body, Param, Query, NotFoundException, InternalServerErrorException,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ContactoService } from './contacto.service';
import { CreateContactoDto } from './dto/create-contacto.dto';
import { UpdateContactoDto } from './dto/update-contacto.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { Contacto } from './entities/contacto.entity';

@Controller('contacto')
export class ContactoController {
  constructor(private readonly contactoService: ContactoService) {}

  @Post()
  async create(@Body() dto: CreateContactoDto) {
    const contacto = await this.contactoService.create(dto);
    return new SuccessResponseDto('Contacto creado con éxito', contacto);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Contacto>>> {
    if (query.limit && query.limit > 100) {
      query.limit = 100;
    }

    const result = await this.contactoService.findAll(query);

    if (!result)
      throw new InternalServerErrorException('No se pudieron obtener los contactos');

    return new SuccessResponseDto('Contactos obtenidos con éxito', result);
  }

  @Get(':id_contacto')
  async findOne(@Param('id_contacto') id_contacto: string) {
    const contacto = await this.contactoService.findOne(id_contacto);
    if (!contacto) throw new NotFoundException('Contacto no encontrado');
    return new SuccessResponseDto('Contacto obtenido con éxito', contacto);
  }

  @Put(':id_contacto')
  async update(
    @Param('id_contacto') id_contacto: string,
    @Body() dto: UpdateContactoDto,
  ) {
    const contacto = await this.contactoService.update(id_contacto, dto);
    if (!contacto) throw new NotFoundException('Contacto no registrado');
    return new SuccessResponseDto('Contacto actualizado con éxito', contacto);
  }

  @Delete(':id_contacto')
  async remove(@Param('id_contacto') id_contacto: string) {
    const contacto = await this.contactoService.remove(id_contacto);
    if (!contacto) throw new NotFoundException('Contacto no encontrado');
    return new SuccessResponseDto('Contacto eliminado con éxito', contacto);
  }
}