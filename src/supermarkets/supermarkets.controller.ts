import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ParsePositiveIntPipe } from '../common/pipes/parse-positive-int.pipe';
import { CreateSupermarketDto } from './dto/create-supermarket.dto';
import { SupermarketResponseDto } from './dto/supermarket-response.dto';
import { UpdateSupermarketDto } from './dto/update-supermarket.dto';
import { SupermarketsService } from './supermarkets.service';

@Controller('supermarkets')
export class SupermarketsController {
  constructor(private readonly service: SupermarketsService) {}

  @Post()
  create(@Body() dto: CreateSupermarketDto): Promise<SupermarketResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  findAll(): Promise<SupermarketResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParsePositiveIntPipe) id: number,
  ): Promise<SupermarketResponseDto> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateSupermarketDto,
  ): Promise<SupermarketResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParsePositiveIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
