import { ProductBranchEntity } from '../entity/product-branch.entity';
import { ProductBranchPriceEntity } from '../entity/product-branch-price.entity';

export const PRODUCT_BRANCH_REPOSITORY = 'productBranchRepository';

export interface CreateProductBranchData {
  ean: string;
  branchId: number;
  active?: boolean;
}
export interface UpdateProductBranchData {
  ean?: string;
  branchId?: number;
  active?: boolean;
}

export interface IProductBranchRepository {
  create(data: CreateProductBranchData): Promise<ProductBranchEntity>;

  findAll(): Promise<ProductBranchEntity[]>;

  findById(id: bigint): Promise<ProductBranchEntity | null>;

  update(
    id: bigint,
    data: UpdateProductBranchData,
  ): Promise<ProductBranchEntity | null>;

  delete(id: bigint): Promise<boolean>;

  findByEanAndBranch(
    ean: string,
    branchId: number,
  ): Promise<ProductBranchPriceEntity | null>;
}
