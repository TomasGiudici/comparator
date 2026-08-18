import { Module } from '@nestjs/common';
import { CatalogApiModule } from '../catalog-api/catalog-api.module';
import { ProductBranchesController } from './product-branches.controller';
import { ProductBranchesService } from './product-branches.service';
import { PrismaProductBranchRepository } from './repository/prisma-product-branch.repository';
import { PRODUCT_BRANCH_REPOSITORY } from './repository/product-branch.repository.interface';

@Module({
  imports: [CatalogApiModule],
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
