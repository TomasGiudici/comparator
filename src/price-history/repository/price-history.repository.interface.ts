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

export interface IPriceHistoryRepository {
  create(data: CreatePriceHistoryData): Promise<PriceHistoryEntity>;
  findAll(): Promise<PriceHistoryEntity[]>;
  findById(id: bigint): Promise<PriceHistoryEntity | null>;
  update(
    id: bigint,
    data: UpdatePriceHistoryData,
  ): Promise<PriceHistoryEntity | null>;
  delete(id: bigint): Promise<boolean>;
}
