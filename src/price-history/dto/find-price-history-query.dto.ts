import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class FindPriceHistoryQueryDto {
  @Type(() => Number)
  @IsInt({ message: 'page debe ser un número entero.' })
  @Min(1, { message: 'page debe ser mayor o igual a 1.' })
  page: number = 1;

  @Type(() => Number)
  @IsInt({ message: 'limit debe ser un número entero.' })
  @Min(1, { message: 'limit debe ser mayor o igual a 1.' })
  @Max(100, { message: 'limit no puede superar 100.' })
  limit: number = 20;
}
