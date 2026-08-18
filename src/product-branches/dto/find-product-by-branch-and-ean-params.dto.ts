import { Type } from 'class-transformer';
import { IsInt, IsString, Matches, Min } from 'class-validator';

export class FindProductByBranchAndEanParamsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  branchId!: number;

  @IsString()
  @Matches(/^\d{13}$/, {
    message: 'ean debe contener exactamente 13 dígitos.',
  })
  ean!: string;
}
