export class ProductReferenceResponseDto {
  id!: number;
  name!: string;
}

export class ProductWithPriceResponseDto {
  id!: number;
  ean!: string;
  name!: string;
  description!: string | null;
  brand!: ProductReferenceResponseDto | null;
  category!: ProductReferenceResponseDto | null;
  quantity!: number | null;
  unitAbbreviation!: string | null;
  imageUrl!: string | null;

  productBranchId!: string;
  branchId!: number;
  price!: string | null;
  priceUpdatedAt!: string | null;
}
