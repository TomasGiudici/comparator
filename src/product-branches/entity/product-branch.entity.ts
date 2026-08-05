export interface ProductBranchEntity {
  id: bigint;
  ean: string;
  branchId: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
