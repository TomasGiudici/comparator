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
import { CreateProductBranchDto } from './dto/create-product-branch.dto';
import { ProductBranchResponseDto } from './dto/product-branch-response.dto';
import { UpdateProductBranchDto } from './dto/update-product-branch.dto';
import { ProductBranchesService } from './product-branches.service';

@Controller('product-branches')
export class ProductBranchesController {
  constructor(private readonly service: ProductBranchesService) {}
  @Post() create(
    @Body() dto: CreateProductBranchDto,
  ): Promise<ProductBranchResponseDto> {
    return this.service.create(dto);
  }
  @Get() findAll(): Promise<ProductBranchResponseDto[]> {
    return this.service.findAll();
  }
  @Get(':id') findOne(
    @Param('id', ParseBigIntPipe) id: bigint,
  ): Promise<ProductBranchResponseDto> {
    return this.service.findOne(id);
  }
  @Patch(':id') update(
    @Param('id', ParseBigIntPipe) id: bigint,
    @Body() dto: UpdateProductBranchDto,
  ): Promise<ProductBranchResponseDto> {
    return this.service.update(id, dto);
  }
  @Delete(':id') @HttpCode(HttpStatus.NO_CONTENT) remove(
    @Param('id', ParseBigIntPipe) id: bigint,
  ): Promise<void> {
    return this.service.remove(id);
  }
}
