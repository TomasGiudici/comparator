import { Inject, Injectable } from '@nestjs/common';
import type { ICatalogApiClient } from './client/catalog-api.client.interface';
import { CATALOG_API_CLIENT } from './client/catalog-api.client.interface';
import { CatalogProductModel } from './model/catalog-product.model';

@Injectable()
export class CatalogApiService {
  constructor(
    @Inject(CATALOG_API_CLIENT)
    private readonly catalogApiClient: ICatalogApiClient,
  ) {}

  findProductByEan(ean: string): Promise<CatalogProductModel> {
    return this.catalogApiClient.findProductByEan(ean);
  }
}
