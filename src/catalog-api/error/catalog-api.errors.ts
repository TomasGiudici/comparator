export class CatalogProductNotFoundError extends Error {
  constructor(public readonly ean: string) {
    super(`Catalog product with EAN ${ean} was not found.`);
    this.name = CatalogProductNotFoundError.name;
  }
}

export class CatalogApiUnavailableError extends Error {
  constructor() {
    super('Catalog API is unavailable.');
    this.name = CatalogApiUnavailableError.name;
  }
}

export class CatalogApiUnexpectedResponseError extends Error {
  constructor(public readonly statusCode: number | null) {
    super(
      statusCode
        ? `Catalog API returned status ${statusCode}.`
        : 'Catalog API returned an unexpected response.',
    );

    this.name = CatalogApiUnexpectedResponseError.name;
  }
}
