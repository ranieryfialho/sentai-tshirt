export interface ProductImage {
  id: number;
  product_id: number;
  src: string;
}

export interface ProductVariant {
  id: number;
  price: number;
  stock: number;
  values?: Array<{
    pt?: string;
  }>;
}

export interface ProductCategory {
  id: number;
  name: string;
  description?: string;
  parent?: number | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  promotional_price?: number;
  images: ProductImage[];
  category: string;
  categories?: ProductCategory[];
  variants: ProductVariant[];
}