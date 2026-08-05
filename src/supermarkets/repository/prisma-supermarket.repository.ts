import { Injectable } from '@nestjs/common';
import { Prisma, supermarkets } from '../../../generated/prisma/client';
import {
  RepositoryForeignKeyConstraintError,
  RepositoryUniqueConstraintError,
} from '../../common/errors/repository.errors';
import { PrismaService } from '../../prisma/prisma.service';
import { SupermarketEntity } from '../entity/supermarket.entity';
import {
  CreateSupermarketData,
  ISupermarketRepository,
  UpdateSupermarketData,
} from './supermarket.repository.interface';

@Injectable()
export class PrismaSupermarketRepository implements ISupermarketRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSupermarketData): Promise<SupermarketEntity> {
    try {
      return this.toEntity(await this.prisma.supermarkets.create({ data }));
    } catch (error: unknown) {
      throw this.translateError(error);
    }
  }

  async findAll(): Promise<SupermarketEntity[]> {
    const records = await this.prisma.supermarkets.findMany({
      orderBy: { id: 'asc' },
    });
    return records.map((record) => this.toEntity(record));
  }

  async findById(id: number): Promise<SupermarketEntity | null> {
    const record = await this.prisma.supermarkets.findUnique({ where: { id } });
    return record ? this.toEntity(record) : null;
  }

  async update(
    id: number,
    data: UpdateSupermarketData,
  ): Promise<SupermarketEntity | null> {
    try {
      const record = await this.prisma.supermarkets.update({
        where: { id },
        data: { ...data, updated_at: new Date() },
      });
      return this.toEntity(record);
    } catch (error: unknown) {
      if (this.hasCode(error, 'P2025')) return null;
      throw this.translateError(error);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.supermarkets.delete({ where: { id } });
      return true;
    } catch (error: unknown) {
      if (this.hasCode(error, 'P2025')) return false;
      throw this.translateError(error);
    }
  }

  private toEntity(record: supermarkets): SupermarketEntity {
    return {
      id: record.id,
      name: record.name,
      active: record.active,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
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
