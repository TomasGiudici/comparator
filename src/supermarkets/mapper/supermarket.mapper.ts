import { SupermarketResponseDto } from '../dto/supermarket-response.dto';
import { SupermarketEntity } from '../entity/supermarket.entity';

export class SupermarketMapper {
  static toResponse(entity: SupermarketEntity): SupermarketResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      active: entity.active,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
