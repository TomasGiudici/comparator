import { BranchEntity } from '../entity/branch.entity';

export const BRANCH_REPOSITORY = 'branchRepository';

export interface CreateBranchData {
  supermarketId: number;
  city?: string | null;
  address?: string | null;
  active?: boolean;
}

export interface UpdateBranchData {
  supermarketId?: number;
  city?: string | null;
  address?: string | null;
  active?: boolean;
}

export interface IBranchRepository {
  create(data: CreateBranchData): Promise<BranchEntity>;
  findAll(): Promise<BranchEntity[]>;
  findById(id: number): Promise<BranchEntity | null>;
  update(id: number, data: UpdateBranchData): Promise<BranchEntity | null>;
  delete(id: number): Promise<boolean>;
}
