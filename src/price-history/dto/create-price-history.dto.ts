import { IsString, Matches } from 'class-validator';

export class CreatePriceHistoryDto {
  @IsString()
  @Matches(/^[1-9]\d*$/, {
    message: 'productBranchId must be a positive integer string',
  })
  productBranchId!: string;

  @IsString()
  @Matches(/^(?:0|[1-9]\d{0,9})\.\d{2}$/, {
    message: 'price must be a decimal string with exactly two decimal places',
  })
  price!: string;
}
