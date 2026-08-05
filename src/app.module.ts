import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BranchesModule } from './branches/branches.module';
import { PriceHistoryModule } from './price-history/price-history.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductBranchesModule } from './product-branches/product-branches.module';
import { SupermarketsModule } from './supermarkets/supermarkets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    PrismaModule,
    SupermarketsModule,
    BranchesModule,
    ProductBranchesModule,
    PriceHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
