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

export interface Coupon {
  id: number;
  code: string;
  type: 'percentage' | 'absolute';
  value: string;
  valid: boolean;
  start_date: string | null;
  end_date: string | null;
  min_price: string | null;
  categories: number[] | null;
  products: number[] | null;
}

export interface Promotion {
  id: number;
  name: string;
  type: 'percentage' | 'fixed_amount' | 'buy_x_get_y';
  value?: number;
  enabled: boolean;
  start_date: string;
  end_date: string;
  applies_to: 'all' | 'categories' | 'products';
  category_ids?: number[];
  product_ids?: number[];
  min_quantity?: number;
  discount_quantity?: number;
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
  applicable_coupons?: Coupon[];
  applicable_promotions?: Promotion[];
}