import { CatalogProductModel } from '../../catalog-api/model/catalog-product.model';
import { ProductWithPriceResponseDto } from '../dto/product-with-price-response.dto';
import { ProductBranchPriceEntity } from '../entity/product-branch-price.entity';

export class ProductWithPriceMapper {
  static toResponse(
    product: CatalogProductModel,
    productBranch: ProductBranchPriceEntity,
  ): ProductWithPriceResponseDto {
    return {
      id: product.id,
      ean: product.ean,
      name: product.name,
      description: product.description,
      brand: product.brand
        ? {
            id: product.brand.id,
            name: product.brand.name,
          }
        : null,
      category: product.category
        ? {
            id: product.category.id,
            name: product.category.name,
          }
        : null,
      quantity: product.quantity,
      unitAbbreviation: product.unitAbbreviation,
      imageUrl: product.imageUrl,

      productBranchId: productBranch.productBranchId.toString(),
      branchId: productBranch.branchId,
      price: productBranch.price,
      priceUpdatedAt: productBranch.priceUpdatedAt?.toISOString() ?? null,
    };
  }
}
