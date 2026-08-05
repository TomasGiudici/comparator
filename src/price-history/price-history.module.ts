import { Module } from '@nestjs/common';
import { PriceHistoryController } from './price-history.controller';
import { PriceHistoryService } from './price-history.service';
import { PrismaPriceHistoryRepository } from './repository/prisma-price-history.repository';
import { PRICE_HISTORY_REPOSITORY } from './repository/price-history.repository.interface';

@Module({
  controllers: [PriceHistoryController],
  providers: [
    PriceHistoryService,
    {
      provide: PRICE_HISTORY_REPOSITORY,
      useClass: PrismaPriceHistoryRepository,
    },
  ],
  exports: [PriceHistoryService, PRICE_HISTORY_REPOSITORY],
})
export class PriceHistoryModule {}
