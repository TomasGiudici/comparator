import { PriceHistoryEntity } from '../entity/price-history.entity';

export const PRICE_HISTORY_REPOSITORY = 'priceHistoryRepository';

export interface CreatePriceHistoryData {
  productBranchId: bigint;
  price: string;
}

export interface UpdatePriceHistoryData {
  productBranchId?: bigint;
  price?: string;
}

export interface FindPriceHistoryPagination {
  skip: number;
  take: number;
}

export interface FindPriceHistoryResult {
  records: PriceHistoryEntity[];
  total: number;
}

export interface IPriceHistoryRepository {
  create(data: CreatePriceHistoryData): Promise<PriceHistoryEntity>;

  findAll(): Promise<PriceHistoryEntity[]>;

  findById(id: bigint): Promise<PriceHistoryEntity | null>;

  findByProductBranchId(
    productBranchId: bigint,
    pagination: FindPriceHistoryPagination,
  ): Promise<FindPriceHistoryResult>;

  update(
    id: bigint,
    data: UpdatePriceHistoryData,
  ): Promise<PriceHistoryEntity | null>;

  delete(id: bigint): Promise<boolean>;
}
