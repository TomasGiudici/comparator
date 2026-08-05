import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdatePriceHistoryDto {
  @IsOptional()
  @IsString()
  @Matches(/^[1-9]\d*$/, {
    message: 'productBranchId must be a positive integer string',
  })
  productBranchId?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(?:0|[1-9]\d{0,9})\.\d{2}$/, {
    message: 'price must be a decimal string with exactly two decimal places',
  })
  price?: string;
}
