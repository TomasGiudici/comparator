import { BranchResponseDto } from '../dto/branch-response.dto';
import { BranchEntity } from '../entity/branch.entity';

export class BranchMapper {
  static toResponse(entity: BranchEntity): BranchResponseDto {
    return {
      ...entity,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
