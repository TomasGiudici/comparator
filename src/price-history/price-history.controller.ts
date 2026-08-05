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
import { ParseBigIntPipe } from '../common/pipes/parse-bigint.pipe';
import { CreatePriceHistoryDto } from './dto/create-price-history.dto';
import { PriceHistoryResponseDto } from './dto/price-history-response.dto';
import { UpdatePriceHistoryDto } from './dto/update-price-history.dto';
import { PriceHistoryService } from './price-history.service';

@Controller('price-history')
export class PriceHistoryController {
  constructor(private readonly service: PriceHistoryService) {}
  @Post() create(
    @Body() dto: CreatePriceHistoryDto,
  ): Promise<PriceHistoryResponseDto> {
    return this.service.create(dto);
  }
  @Get() findAll(): Promise<PriceHistoryResponseDto[]> {
    return this.service.findAll();
  }
  @Get(':id') findOne(
    @Param('id', ParseBigIntPipe) id: bigint,
  ): Promise<PriceHistoryResponseDto> {
    return this.service.findOne(id);
  }
  @Patch(':id') update(
    @Param('id', ParseBigIntPipe) id: bigint,
    @Body() dto: UpdatePriceHistoryDto,
  ): Promise<PriceHistoryResponseDto> {
    return this.service.update(id, dto);
  }
  @Delete(':id') @HttpCode(HttpStatus.NO_CONTENT) remove(
    @Param('id', ParseBigIntPipe) id: bigint,
  ): Promise<void> {
    return this.service.remove(id);
  }
}
