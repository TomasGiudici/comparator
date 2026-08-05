import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RepositoryForeignKeyConstraintError } from '../common/errors/repository.errors';
import { CreatePriceHistoryDto } from './dto/create-price-history.dto';
import { PriceHistoryResponseDto } from './dto/price-history-response.dto';
import { UpdatePriceHistoryDto } from './dto/update-price-history.dto';
import { PriceHistoryMapper } from './mapper/price-history.mapper';
import { PRICE_HISTORY_REPOSITORY } from './repository/price-history.repository.interface';
import type { IPriceHistoryRepository } from './repository/price-history.repository.interface';

@Injectable()
export class PriceHistoryService {
  constructor(
    @Inject(PRICE_HISTORY_REPOSITORY)
    private readonly repository: IPriceHistoryRepository,
  ) {}

  async create(dto: CreatePriceHistoryDto): Promise<PriceHistoryResponseDto> {
    try {
      return PriceHistoryMapper.toResponse(
        await this.repository.create({
          productBranchId: BigInt(dto.productBranchId),
          price: dto.price,
        }),
      );
    } catch (error: unknown) {
      this.translateRelationError(error);
    }
  }

  async findAll(): Promise<PriceHistoryResponseDto[]> {
    return (await this.repository.findAll()).map((entity) =>
      PriceHistoryMapper.toResponse(entity),
    );
  }

  async findOne(id: bigint): Promise<PriceHistoryResponseDto> {
    const entity = await this.repository.findById(id);
    if (!entity)
      throw new NotFoundException('Registro de precio no encontrado.');
    return PriceHistoryMapper.toResponse(entity);
  }

  async update(
    id: bigint,
    dto: UpdatePriceHistoryDto,
  ): Promise<PriceHistoryResponseDto> {
    try {
      const entity = await this.repository.update(id, {
        productBranchId:
          dto.productBranchId === undefined
            ? undefined
            : BigInt(dto.productBranchId),
        price: dto.price,
      });
      if (!entity)
        throw new NotFoundException('Registro de precio no encontrado.');
      return PriceHistoryMapper.toResponse(entity);
    } catch (error: unknown) {
      this.translateRelationError(error);
    }
  }

  async remove(id: bigint): Promise<void> {
    if (!(await this.repository.delete(id)))
      throw new NotFoundException('Registro de precio no encontrado.');
  }

  private translateRelationError(error: unknown): never {
    if (error instanceof RepositoryForeignKeyConstraintError)
      throw new BadRequestException(
        'El producto por sucursal indicado no existe.',
      );
    throw error;
  }
}
