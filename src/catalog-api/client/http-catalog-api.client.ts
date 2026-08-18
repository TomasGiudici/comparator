import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { isAxiosError } from 'axios';
import {
  CatalogApiUnexpectedResponseError,
  CatalogApiUnavailableError,
  CatalogProductNotFoundError,
} from '../error/catalog-api.errors';
import { CatalogProductModel } from '../model/catalog-product.model';
import { ICatalogApiClient } from './catalog-api.client.interface';

@Injectable()
export class HttpCatalogApiClient implements ICatalogApiClient {
  constructor(private readonly httpService: HttpService) {}

  async findProductByEan(ean: string): Promise<CatalogProductModel> {
    try {
      const response = await this.httpService.axiosRef.get<CatalogProductModel>(
        `items/ean/${encodeURIComponent(ean)}`,
      );

      return response.data;
    } catch (error: unknown) {
      if (!isAxiosError(error)) {
        throw error;
      }

      if (error.response?.status === 404) {
        throw new CatalogProductNotFoundError(ean);
      }

      if (
        !error.response ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ECONNABORTED' ||
        error.code === 'ETIMEDOUT'
      ) {
        throw new CatalogApiUnavailableError();
      }

      throw new CatalogApiUnexpectedResponseError(error.response.status);
    }
  }
}
