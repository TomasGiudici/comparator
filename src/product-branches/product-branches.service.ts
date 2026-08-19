import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { CatalogApiService } from '../catalog-api/catalog-api.service';
import {
  CatalogApiUnexpectedResponseError,
  CatalogApiUnavailableError,
  CatalogProductNotFoundError,
} from '../catalog-api/error/catalog-api.errors';
import {
  RepositoryForeignKeyConstraintError,
  RepositoryUniqueConstraintError,
} from '../common/errors/repository.errors';
import { PriceHistoryResponseDto } from '../price-history/dto/price-history-response.dto';
import { PriceHistoryService } from '../price-history/price-history.service';
import { CreateProductBranchDto } from './dto/create-product-branch.dto';
import { ProductBranchResponseDto } from './dto/product-branch-response.dto';
import { ProductWithPriceResponseDto } from './dto/product-with-price-response.dto';
import { UpdateProductBranchDto } from './dto/update-product-branch.dto';
import { UpdateProductPriceDto } from './dto/update-product-price.dto';
import { ProductBranchMapper } from './mapper/product-branch.mapper';
import { ProductWithPriceMapper } from './mapper/product-with-price.mapper';
import { PRODUCT_BRANCH_REPOSITORY } from './repository/product-branch.repository.interface';
import type { IProductBranchRepository } from './repository/product-branch.repository.interface';
import { FindPriceHistoryQueryDto } from '../price-history/dto/find-price-history-query.dto';
import { PaginatedPriceHistoryResponseDto } from '../price-history/dto/paginated-price-history-response.dto';

@Injectable()
export class ProductBranchesService {
  constructor(
    @Inject(PRODUCT_BRANCH_REPOSITORY)
    private readonly productBranchRepository: IProductBranchRepository,

    private readonly catalogApiService: CatalogApiService,

    private readonly priceHistoryService: PriceHistoryService,
  ) {}

  async create(dto: CreateProductBranchDto): Promise<ProductBranchResponseDto> {
    try {
      return ProductBranchMapper.toResponse(
        await this.productBranchRepository.create(dto),
      );
    } catch (error: unknown) {
      this.translateWriteError(error);
    }
  }

  async findAll(): Promise<ProductBranchResponseDto[]> {
    return (await this.productBranchRepository.findAll()).map((entity) =>
      ProductBranchMapper.toResponse(entity),
    );
  }

  async findOne(id: bigint): Promise<ProductBranchResponseDto> {
    const entity = await this.productBranchRepository.findById(id);

    if (!entity) {
      throw new NotFoundException('Producto por sucursal no encontrado.');
    }

    return ProductBranchMapper.toResponse(entity);
  }

  async update(
    id: bigint,
    dto: UpdateProductBranchDto,
  ): Promise<ProductBranchResponseDto> {
    try {
      const entity = await this.productBranchRepository.update(id, dto);

      if (!entity) {
        throw new NotFoundException('Producto por sucursal no encontrado.');
      }

      return ProductBranchMapper.toResponse(entity);
    } catch (error: unknown) {
      this.translateWriteError(error);
    }
  }

  async remove(id: bigint): Promise<void> {
    try {
      if (!(await this.productBranchRepository.delete(id))) {
        throw new NotFoundException('Producto por sucursal no encontrado.');
      }
    } catch (error: unknown) {
      if (error instanceof RepositoryForeignKeyConstraintError) {
        throw new ConflictException(
          'No se puede eliminar el producto por sucursal porque tiene precios relacionados.',
        );
      }

      throw error;
    }
  }

  async findProductByBranchAndEan(
    branchId: number,
    ean: string,
  ): Promise<ProductWithPriceResponseDto> {
    try {
      const product = await this.catalogApiService.findProductByEan(ean);

      const productBranch =
        await this.productBranchRepository.findByEanAndBranch(ean, branchId);

      if (!productBranch) {
        throw new NotFoundException(
          'El producto no está disponible en la sucursal indicada.',
        );
      }

      return ProductWithPriceMapper.toResponse(product, productBranch);
    } catch (error: unknown) {
      if (error instanceof CatalogProductNotFoundError) {
        throw new NotFoundException('Producto no encontrado.');
      }

      if (error instanceof CatalogApiUnavailableError) {
        throw new ServiceUnavailableException(
          'La API de catálogo no está disponible.',
        );
      }

      if (error instanceof CatalogApiUnexpectedResponseError) {
        throw new BadGatewayException(
          'La API de catálogo devolvió una respuesta inesperada.',
        );
      }

      throw error;
    }
  }

  async updateProductPrice(
    branchId: number,
    ean: string,
    dto: UpdateProductPriceDto,
  ): Promise<PriceHistoryResponseDto> {
    const productBranch = await this.productBranchRepository.findByEanAndBranch(
      ean,
      branchId,
    );

    if (!productBranch) {
      throw new NotFoundException(
        'El producto no está disponible en la sucursal indicada.',
      );
    }

    return this.priceHistoryService.createForProductBranch(
      productBranch.productBranchId,
      dto.price,
    );
  }

  private translateWriteError(error: unknown): never {
    if (error instanceof RepositoryUniqueConstraintError) {
      throw new ConflictException(
        'El producto ya está registrado en esa sucursal.',
      );
    }

    if (error instanceof RepositoryForeignKeyConstraintError) {
      throw new BadRequestException('La sucursal indicada no existe.');
    }

    throw error;
  }

  async findPriceHistoryByBranchAndEan(
    branchId: number,
    ean: string,
    query: FindPriceHistoryQueryDto,
  ): Promise<PaginatedPriceHistoryResponseDto> {
    const productBranch = await this.productBranchRepository.findByEanAndBranch(
      ean,
      branchId,
    );

    if (!productBranch) {
      throw new NotFoundException(
        'El producto no está disponible en la sucursal indicada.',
      );
    }

    return this.priceHistoryService.findByProductBranchId(
      productBranch.productBranchId,
      query,
    );
  }
}
