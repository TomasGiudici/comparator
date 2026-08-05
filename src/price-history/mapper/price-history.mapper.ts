import { PriceHistoryResponseDto } from '../dto/price-history-response.dto';
import { PriceHistoryEntity } from '../entity/price-history.entity';

export class PriceHistoryMapper {
  static toResponse(entity: PriceHistoryEntity): PriceHistoryResponseDto {
    return {
      id: entity.id.toString(),
      productBranchId: entity.productBranchId.toString(),
      price: entity.price,
      createdAt: entity.createdAt.toISOString(),
    };
  }
}
