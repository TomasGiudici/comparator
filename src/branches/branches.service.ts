import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RepositoryForeignKeyConstraintError } from '../common/errors/repository.errors';
import { BranchResponseDto } from './dto/branch-response.dto';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { BranchMapper } from './mapper/branch.mapper';
import { BRANCH_REPOSITORY } from './repository/branch.repository.interface';
import type { IBranchRepository } from './repository/branch.repository.interface';

@Injectable()
export class BranchesService {
  constructor(
    @Inject(BRANCH_REPOSITORY) private readonly repository: IBranchRepository,
  ) {}

  async create(dto: CreateBranchDto): Promise<BranchResponseDto> {
    try {
      return BranchMapper.toResponse(await this.repository.create(dto));
    } catch (error: unknown) {
      if (error instanceof RepositoryForeignKeyConstraintError)
        throw new BadRequestException('El supermercado indicado no existe.');
      throw error;
    }
  }

  async findAll(): Promise<BranchResponseDto[]> {
    return (await this.repository.findAll()).map((entity) =>
      BranchMapper.toResponse(entity),
    );
  }

  async findOne(id: number): Promise<BranchResponseDto> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException('Sucursal no encontrada.');
    return BranchMapper.toResponse(entity);
  }

  async update(id: number, dto: UpdateBranchDto): Promise<BranchResponseDto> {
    try {
      const entity = await this.repository.update(id, dto);
      if (!entity) throw new NotFoundException('Sucursal no encontrada.');
      return BranchMapper.toResponse(entity);
    } catch (error: unknown) {
      if (error instanceof RepositoryForeignKeyConstraintError)
        throw new BadRequestException('El supermercado indicado no existe.');
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      if (!(await this.repository.delete(id)))
        throw new NotFoundException('Sucursal no encontrada.');
    } catch (error: unknown) {
      if (error instanceof RepositoryForeignKeyConstraintError)
        throw new ConflictException(
          'No se puede eliminar la sucursal porque tiene productos relacionados.',
        );
      throw error;
    }
  }
}
