import { PriceHistoryResponseDto } from './price-history-response.dto';

export class PriceHistoryPaginationMetaDto {
  page!: number;
  limit!: number;
  total!: number;
  totalPages!: number;
  hasNextPage!: boolean;
  hasPreviousPage!: boolean;
}

export class PaginatedPriceHistoryResponseDto {
  data!: PriceHistoryResponseDto[];
  meta!: PriceHistoryPaginationMetaDto;
}
