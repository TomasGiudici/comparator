import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CATALOG_API_CLIENT } from './client/catalog-api.client.interface';
import { HttpCatalogApiClient } from './client/http-catalog-api.client';
import { CatalogApiService } from './catalog-api.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const baseURL = configService
          .getOrThrow<string>('CATALOG_API_BASE_URL')
          .replace(/\/+$/, '');

        const timeout = Number(
          configService.get<string>('CATALOG_API_TIMEOUT_MS', '5000'),
        );

        if (!Number.isFinite(timeout) || timeout <= 0) {
          throw new Error('CATALOG_API_TIMEOUT_MS must be a positive number.');
        }

        return {
          baseURL,
          timeout,
          maxRedirects: 0,
        };
      },
    }),
  ],
  providers: [
    CatalogApiService,
    {
      provide: CATALOG_API_CLIENT,
      useClass: HttpCatalogApiClient,
    },
  ],
  exports: [CatalogApiService],
})
export class CatalogApiModule {}
