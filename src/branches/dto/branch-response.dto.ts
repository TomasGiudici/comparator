export class BranchResponseDto {
  id!: number;
  supermarketId!: number;
  city!: string | null;
  address!: string | null;
  active!: boolean;
  createdAt!: string;
  updatedAt!: string;
}
