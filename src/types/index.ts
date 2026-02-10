export interface Image {
  id: number;
  src: string;
  alt?: string;
}

export interface ProductVariant {
  id: number;
  name: string;
  price: number;
  stock: number;
  sku: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  promotional_price?: number;
  images: Image[];
  category: string;
  variants?: ProductVariant[];
  tags?: string[];
  specs?: Record<string, string>;
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariantId?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}