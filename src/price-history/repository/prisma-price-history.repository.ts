import { Injectable } from '@nestjs/common';
import { price_history, Prisma } from '../../../generated/prisma/client';
import {
  RepositoryForeignKeyConstraintError,
  RepositoryUniqueConstraintError,
} from '../../common/errors/repository.errors';
import { PrismaService } from '../../prisma/prisma.service';
import { PriceHistoryEntity } from '../entity/price-history.entity';
import {
  CreatePriceHistoryData,
  IPriceHistoryRepository,
  UpdatePriceHistoryData,
} from './price-history.repository.interface';

@Injectable()
export class PrismaPriceHistoryRepository implements IPriceHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePriceHistoryData): Promise<PriceHistoryEntity> {
    try {
      return this.toEntity(
        await this.prisma.price_history.create({
          data: {
            product_branch_id: data.productBranchId,
            price: new Prisma.Decimal(data.price),
          },
        }),
      );
    } catch (error: unknown) {
      throw this.translateError(error);
    }
  }

  async findAll(): Promise<PriceHistoryEntity[]> {
    return (
      await this.prisma.price_history.findMany({ orderBy: { id: 'asc' } })
    ).map((record) => this.toEntity(record));
  }

  async findById(id: bigint): Promise<PriceHistoryEntity | null> {
    const record = await this.prisma.price_history.findUnique({
      where: { id },
    });
    return record ? this.toEntity(record) : null;
  }

  async update(
    id: bigint,
    data: UpdatePriceHistoryData,
  ): Promise<PriceHistoryEntity | null> {
    try {
      return this.toEntity(
        await this.prisma.price_history.update({
          where: { id },
          data: this.toPersistence(data),
        }),
      );
    } catch (error: unknown) {
      if (this.hasCode(error, 'P2025')) return null;
      throw this.translateError(error);
    }
  }

  async delete(id: bigint): Promise<boolean> {
    try {
      await this.prisma.price_history.delete({ where: { id } });
      return true;
    } catch (error: unknown) {
      if (this.hasCode(error, 'P2025')) return false;
      throw this.translateError(error);
    }
  }

  private toPersistence(
    data: CreatePriceHistoryData | UpdatePriceHistoryData,
  ): { product_branch_id?: bigint; price?: Prisma.Decimal } {
    return {
      product_branch_id: data.productBranchId,
      price:
        data.price === undefined ? undefined : new Prisma.Decimal(data.price),
    };
  }

  private toEntity(record: price_history): PriceHistoryEntity {
    return {
      id: record.id,
      productBranchId: record.product_branch_id,
      price: record.price.toFixed(2),
      createdAt: record.created_at,
    };
  }

  private translateError(error: unknown): unknown {
    if (this.hasCode(error, 'P2002'))
      return new RepositoryUniqueConstraintError();
    if (this.hasCode(error, 'P2003'))
      return new RepositoryForeignKeyConstraintError();
    return error;
  }

  private hasCode(error: unknown, code: string): boolean {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === code
    );
  }
}
