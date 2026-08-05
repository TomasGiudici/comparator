import { Module } from '@nestjs/common';
import { BranchesController } from './branches.controller';
import { BranchesService } from './branches.service';
import { BRANCH_REPOSITORY } from './repository/branch.repository.interface';
import { PrismaBranchRepository } from './repository/prisma-branch.repository';

@Module({
  controllers: [BranchesController],
  providers: [
    BranchesService,
    { provide: BRANCH_REPOSITORY, useClass: PrismaBranchRepository },
  ],
  exports: [BranchesService, BRANCH_REPOSITORY],
})
export class BranchesModule {}
