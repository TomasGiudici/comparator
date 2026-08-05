import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  RepositoryForeignKeyConstraintError,
  RepositoryUniqueConstraintError,
} from '../common/errors/repository.errors';
import { CreateSupermarketDto } from './dto/create-supermarket.dto';
import { SupermarketResponseDto } from './dto/supermarket-response.dto';
import { UpdateSupermarketDto } from './dto/update-supermarket.dto';
import { SupermarketMapper } from './mapper/supermarket.mapper';
import { SUPERMARKET_REPOSITORY } from './repository/supermarket.repository.interface';
import type { ISupermarketRepository } from './repository/supermarket.repository.interface';

@Injectable()
export class SupermarketsService {
  constructor(
    @Inject(SUPERMARKET_REPOSITORY)
    private readonly repository: ISupermarketRepository,
  ) {}

  async create(dto: CreateSupermarketDto): Promise<SupermarketResponseDto> {
    try {
      return SupermarketMapper.toResponse(await this.repository.create(dto));
    } catch (error: unknown) {
      if (error instanceof RepositoryUniqueConstraintError)
        throw new ConflictException(
          'Ya existe un supermercado con ese nombre.',
        );
      throw error;
    }
  }

  async findAll(): Promise<SupermarketResponseDto[]> {
    return (await this.repository.findAll()).map((entity) =>
      SupermarketMapper.toResponse(entity),
    );
  }

  async findOne(id: number): Promise<SupermarketResponseDto> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException('Supermercado no encontrado.');
    return SupermarketMapper.toResponse(entity);
  }

  async update(
    id: number,
    dto: UpdateSupermarketDto,
  ): Promise<SupermarketResponseDto> {
    try {
      const entity = await this.repository.update(id, dto);
      if (!entity) throw new NotFoundException('Supermercado no encontrado.');
      return SupermarketMapper.toResponse(entity);
    } catch (error: unknown) {
      if (error instanceof RepositoryUniqueConstraintError)
        throw new ConflictException(
          'Ya existe un supermercado con ese nombre.',
        );
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      if (!(await this.repository.delete(id)))
        throw new NotFoundException('Supermercado no encontrado.');
    } catch (error: unknown) {
      if (error instanceof RepositoryForeignKeyConstraintError)
        throw new ConflictException(
          'No se puede eliminar el supermercado porque tiene sucursales relacionadas.',
        );
      throw error;
    }
  }
}
