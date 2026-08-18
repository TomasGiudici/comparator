export interface ProductBranchPriceEntity {
  productBranchId: bigint;
  branchId: number;
  price: string | null;
  priceUpdatedAt: Date | null;
}
