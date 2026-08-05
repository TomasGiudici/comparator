import { Module } from '@nestjs/common';
import { ProductBranchesController } from './product-branches.controller';
import { ProductBranchesService } from './product-branches.service';
import { PrismaProductBranchRepository } from './repository/prisma-product-branch.repository';
import { PRODUCT_BRANCH_REPOSITORY } from './repository/product-branch.repository.interface';

@Module({
  controllers: [ProductBranchesController],
  providers: [
    ProductBranchesService,
    {
      provide: PRODUCT_BRANCH_REPOSITORY,
      useClass: PrismaProductBranchRepository,
    },
  ],
  exports: [ProductBranchesService, PRODUCT_BRANCH_REPOSITORY],
})
export class ProductBranchesModule {}
