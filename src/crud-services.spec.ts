import { NotFoundException } from '@nestjs/common';
import { BranchesService } from './branches/branches.service';
import type { IBranchRepository } from './branches/repository/branch.repository.interface';
import { PriceHistoryService } from './price-history/price-history.service';
import type { IPriceHistoryRepository } from './price-history/repository/price-history.repository.interface';
import { ProductBranchesService } from './product-branches/product-branches.service';
import type { IProductBranchRepository } from './product-branches/repository/product-branch.repository.interface';
import type { ISupermarketRepository } from './supermarkets/repository/supermarket.repository.interface';
import { SupermarketsService } from './supermarkets/supermarkets.service';

describe('CRUD services', () => {
  it('serializes supermarket dates in create responses', async () => {
    const createdAt = new Date('2026-01-01T00:00:00.000Z');
    const repository: ISupermarketRepository = {
      create: jest.fn().mockResolvedValue({
        id: 1,
        name: 'Market',
        active: true,
        createdAt,
        updatedAt: createdAt,
      }),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    await expect(
      new SupermarketsService(repository).create({ name: 'Market' }),
    ).resolves.toEqual({
      id: 1,
      name: 'Market',
      active: true,
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
    });
  });

  it.each([
    [
      'supermarket',
      () => new SupermarketsService(missingSupermarketRepository()).findOne(1),
    ],
    ['branch', () => new BranchesService(missingBranchRepository()).findOne(1)],
    [
      'product branch',
      () =>
        new ProductBranchesService(missingProductBranchRepository()).findOne(
          1n,
        ),
    ],
    [
      'price history',
      () =>
        new PriceHistoryService(missingPriceHistoryRepository()).findOne(1n),
    ],
  ])('returns not found for a missing %s', async (_resource, operation) => {
    await expect(operation()).rejects.toBeInstanceOf(NotFoundException);
  });
});

function missingSupermarketRepository(): ISupermarketRepository {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn().mockResolvedValue(null),
    update: jest.fn(),
    delete: jest.fn(),
  };
}

function missingBranchRepository(): IBranchRepository {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn().mockResolvedValue(null),
    update: jest.fn(),
    delete: jest.fn(),
  };
}

function missingProductBranchRepository(): IProductBranchRepository {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn().mockResolvedValue(null),
    update: jest.fn(),
    delete: jest.fn(),
  };
}

function missingPriceHistoryRepository(): IPriceHistoryRepository {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn().mockResolvedValue(null),
    update: jest.fn(),
    delete: jest.fn(),
  };
}
