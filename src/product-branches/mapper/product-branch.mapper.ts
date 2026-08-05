import { ProductBranchResponseDto } from '../dto/product-branch-response.dto';
import { ProductBranchEntity } from '../entity/product-branch.entity';

export class ProductBranchMapper {
  static toResponse(entity: ProductBranchEntity): ProductBranchResponseDto {
    return {
      id: entity.id.toString(),
      ean: entity.ean,
      branchId: entity.branchId,
      active: entity.active,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
