import { Injectable } from '@nestjs/common';
import { Prisma, product_branches } from '../../../generated/prisma/client';
import {
  RepositoryForeignKeyConstraintError,
  RepositoryUniqueConstraintError,
} from '../../common/errors/repository.errors';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductBranchEntity } from '../entity/product-branch.entity';
import {
  CreateProductBranchData,
  IProductBranchRepository,
  UpdateProductBranchData,
} from './product-branch.repository.interface';

@Injectable()
export class PrismaProductBranchRepository implements IProductBranchRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductBranchData): Promise<ProductBranchEntity> {
    try {
      return this.toEntity(
        await this.prisma.product_branches.create({
          data: {
            ean: data.ean,
            branch_id: data.branchId,
            active: data.active,
          },
        }),
      );
    } catch (error: unknown) {
      throw this.translateError(error);
    }
  }

  async findAll(): Promise<ProductBranchEntity[]> {
    return (
      await this.prisma.product_branches.findMany({ orderBy: { id: 'asc' } })
    ).map((record) => this.toEntity(record));
  }

  async findById(id: bigint): Promise<ProductBranchEntity | null> {
    const record = await this.prisma.product_branches.findUnique({
      where: { id },
    });
    return record ? this.toEntity(record) : null;
  }

  async update(
    id: bigint,
    data: UpdateProductBranchData,
  ): Promise<ProductBranchEntity | null> {
    try {
      return this.toEntity(
        await this.prisma.product_branches.update({
          where: { id },
          data: { ...this.toPersistence(data), updated_at: new Date() },
        }),
      );
    } catch (error: unknown) {
      if (this.hasCode(error, 'P2025')) return null;
      throw this.translateError(error);
    }
  }

  async delete(id: bigint): Promise<boolean> {
    try {
      await this.prisma.product_branches.delete({ where: { id } });
      return true;
    } catch (error: unknown) {
      if (this.hasCode(error, 'P2025')) return false;
      throw this.translateError(error);
    }
  }

  private toPersistence(
    data: CreateProductBranchData | UpdateProductBranchData,
  ): { ean?: string; branch_id?: number; active?: boolean } {
    return { ean: data.ean, branch_id: data.branchId, active: data.active };
  }

  private toEntity(record: product_branches): ProductBranchEntity {
    return {
      id: record.id,
      ean: record.ean,
      branchId: record.branch_id,
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
