import { Module } from '@nestjs/common';
import { PrismaSupermarketRepository } from './repository/prisma-supermarket.repository';
import { SUPERMARKET_REPOSITORY } from './repository/supermarket.repository.interface';
import { SupermarketsController } from './supermarkets.controller';
import { SupermarketsService } from './supermarkets.service';

@Module({
  controllers: [SupermarketsController],
  providers: [
    SupermarketsService,
    { provide: SUPERMARKET_REPOSITORY, useClass: PrismaSupermarketRepository },
  ],
  exports: [SupermarketsService, SUPERMARKET_REPOSITORY],
})
export class SupermarketsModule {}
