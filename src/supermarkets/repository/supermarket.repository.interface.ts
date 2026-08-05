import { SupermarketEntity } from '../entity/supermarket.entity';

export const SUPERMARKET_REPOSITORY = 'supermarketRepository';

export interface CreateSupermarketData {
  name: string;
  active?: boolean;
}

export interface UpdateSupermarketData {
  name?: string;
  active?: boolean;
}

export interface ISupermarketRepository {
  create(data: CreateSupermarketData): Promise<SupermarketEntity>;
  findAll(): Promise<SupermarketEntity[]>;
  findById(id: number): Promise<SupermarketEntity | null>;
  update(
    id: number,
    data: UpdateSupermarketData,
  ): Promise<SupermarketEntity | null>;
  delete(id: number): Promise<boolean>;
}
