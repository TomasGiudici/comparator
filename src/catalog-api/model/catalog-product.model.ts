export interface CatalogProductReferenceModel {
  id: number;
  name: string;
}

export interface CatalogProductModel {
  id: number;
  ean: string;
  name: string;
  description: string | null;
  brand: CatalogProductReferenceModel | null;
  category: CatalogProductReferenceModel | null;
  quantity: number | null;
  unitAbbreviation: string | null;
  imageUrl: string | null;
}
