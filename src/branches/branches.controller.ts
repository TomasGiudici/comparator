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
import { BranchesService } from './branches.service';
import { BranchResponseDto } from './dto/branch-response.dto';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Controller('branches')
export class BranchesController {
  constructor(private readonly service: BranchesService) {}
  @Post() create(@Body() dto: CreateBranchDto): Promise<BranchResponseDto> {
    return this.service.create(dto);
  }
  @Get() findAll(): Promise<BranchResponseDto[]> {
    return this.service.findAll();
  }
  @Get(':id') findOne(
    @Param('id', ParsePositiveIntPipe) id: number,
  ): Promise<BranchResponseDto> {
    return this.service.findOne(id);
  }
  @Patch(':id') update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateBranchDto,
  ): Promise<BranchResponseDto> {
    return this.service.update(id, dto);
  }
  @Delete(':id') @HttpCode(HttpStatus.NO_CONTENT) remove(
    @Param('id', ParsePositiveIntPipe) id: number,
  ): Promise<void> {
    return this.service.remove(id);
  }
}
