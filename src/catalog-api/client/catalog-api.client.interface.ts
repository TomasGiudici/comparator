import { CatalogProductModel } from '../model/catalog-product.model';

export const CATALOG_API_CLIENT = 'catalogApiClient';

export interface ICatalogApiClient {
  findProductByEan(ean: string): Promise<CatalogProductModel>;
}
