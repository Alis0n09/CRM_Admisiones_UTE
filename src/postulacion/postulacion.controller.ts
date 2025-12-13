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
import { PostulacionService } from './postulacion.service';
import { CreatePostulacionDto } from './dto/create-postulacion.dto';
import { UpdatePostulacionDto } from './dto/update-postulacion.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { Postulacion } from './entities/postulacion.entity';

@Controller('postulacion')
export class PostulacionController {
  constructor(private readonly postulacionService: PostulacionService) {}

  @Post()
  async create(@Body() dto: CreatePostulacionDto) {
    const postulacion = await this.postulacionService.create(dto);
    if (!postulacion)
      throw new InternalServerErrorException('No se pudo crear la postulación');

    return new SuccessResponseDto('Postulación creada con éxito', postulacion);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Postulacion>>> {
    const result = await this.postulacionService.findAll(query);
    return new SuccessResponseDto('Postulaciones obtenidas con éxito', result);
  }

  @Get(':id_postulacion')
  async findOne(@Param('id_postulacion') id_postulacion: string) {
    const postulacion = await this.postulacionService.findOne(id_postulacion);
    if (!postulacion) throw new NotFoundException('Postulación no encontrada');

    return new SuccessResponseDto('Postulación obtenida con éxito', postulacion);
  }

  @Put(':id_postulacion')
  async update(
    @Param('id_postulacion') id_postulacion: string,
    @Body() dto: UpdatePostulacionDto,
  ) {
    const postulacion = await this.postulacionService.update(id_postulacion, dto);
    if (!postulacion) throw new NotFoundException('Postulación no encontrada');

    return new SuccessResponseDto('Postulación actualizada con éxito', postulacion);
  }

  @Delete(':id_postulacion')
  async remove(@Param('id_postulacion') id_postulacion: string) {
    const postulacion = await this.postulacionService.remove(id_postulacion);
    if (!postulacion) throw new NotFoundException('Postulación no encontrada');

    return new SuccessResponseDto('Postulación eliminada con éxito', postulacion);
  }
}
