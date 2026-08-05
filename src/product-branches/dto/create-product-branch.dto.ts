import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsPositive,
  Matches,
} from 'class-validator';

export class CreateProductBranchDto {
  @Matches(/^\d{13}$/, { message: 'ean must contain exactly 13 digits' })
  ean!: string;

  @IsInt()
  @IsPositive()
  branchId!: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
