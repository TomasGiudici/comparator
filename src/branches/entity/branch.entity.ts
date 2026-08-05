export interface BranchEntity {
  id: number;
  supermarketId: number;
  city: string | null;
  address: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
