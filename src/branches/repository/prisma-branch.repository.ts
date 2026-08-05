import { Injectable } from '@nestjs/common';
import { branches, Prisma } from '../../../generated/prisma/client';
import {
  RepositoryForeignKeyConstraintError,
  RepositoryUniqueConstraintError,
} from '../../common/errors/repository.errors';
import { PrismaService } from '../../prisma/prisma.service';
import { BranchEntity } from '../entity/branch.entity';
import {
  CreateBranchData,
  IBranchRepository,
  UpdateBranchData,
} from './branch.repository.interface';

@Injectable()
export class PrismaBranchRepository implements IBranchRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateBranchData): Promise<BranchEntity> {
    try {
      const record = await this.prisma.branches.create({
        data: {
          supermarket_id: data.supermarketId,
          city: data.city,
          address: data.address,
          active: data.active,
        },
      });
      return this.toEntity(record);
    } catch (error: unknown) {
      throw this.translateError(error);
    }
  }

  async findAll(): Promise<BranchEntity[]> {
    return (
      await this.prisma.branches.findMany({ orderBy: { id: 'asc' } })
    ).map((record) => this.toEntity(record));
  }

  async findById(id: number): Promise<BranchEntity | null> {
    const record = await this.prisma.branches.findUnique({ where: { id } });
    return record ? this.toEntity(record) : null;
  }

  async update(
    id: number,
    data: UpdateBranchData,
  ): Promise<BranchEntity | null> {
    try {
      const record = await this.prisma.branches.update({
        where: { id },
        data: { ...this.toPersistence(data), updated_at: new Date() },
      });
      return this.toEntity(record);
    } catch (error: unknown) {
      if (this.hasCode(error, 'P2025')) return null;
      throw this.translateError(error);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.branches.delete({ where: { id } });
      return true;
    } catch (error: unknown) {
      if (this.hasCode(error, 'P2025')) return false;
      throw this.translateError(error);
    }
  }

  private toPersistence(data: CreateBranchData | UpdateBranchData): {
    supermarket_id?: number;
    city?: string | null;
    address?: string | null;
    active?: boolean;
  } {
    return {
      supermarket_id: data.supermarketId,
      city: data.city,
      address: data.address,
      active: data.active,
    };
  }

  private toEntity(record: branches): BranchEntity {
    return {
      id: record.id,
      supermarketId: record.supermarket_id,
      city: record.city,
      address: record.address,
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
