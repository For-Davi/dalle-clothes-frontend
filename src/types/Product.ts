import type { QuasarSelect } from './Quasar';

export type ProductModalTabs = 'basic' | 'tag' | 'media' | 'variant' | 'advanced' | 'log';

interface ProductColor {
  id: number;
  name: string;
  hexColorCode: string;
}
export interface ProductVariant {
  price: string;
  cost: string;
  stockQuantity: string;
  minStockAlert: string;
  sku: string;
  active: number;
  description: string;
  gridItem: {
    id: number;
    size: string;
  };
  colors: ProductColor[];
}

export interface VModelProductVariant {
  price: string;
  cost: string;
  offer: string;
  stockQuantity: string;
  minStockAlert: string;
  sku: string;
  active: number;
  description: string;
  location: string;
  gridItem: {
    id: number;
    size: string;
  };
  colors: ProductColor[];
}

export interface VModelProductBasic {
  name: string;
  description: string;
  type: QuasarSelect<string>;
  category: QuasarSelect<number | null>;
}

export interface VModelProductAdvanced {
  active: number;
  allowCoupon: number;
  allowDiscount: number;
  discountMaxPercentage: string;
  hasCommission: number;
  commissionPercentage: string;
}
export interface DataCreateProduct {
  basic: {
    name: string;
    description: string | null;
    type: string;
    categoryID: number | null;
  };
  variants: {
    price: number;
    cost: number;
    stockQuantity: number;
    minStockQuantity: number;
    sku: string | null;
    active: number;
    description: string | null;
    location: string | null;
    gridItemID: number | null;
    colors: { id: number }[];
  }[];
  images: File[];
  tags: { id: number }[];
  advanced: {
    active: number;
    allowCoupon: number;
    allowDiscount: number;
    discountMaxPercentage: number;
    hasCommission: number;
    commissionPercentage: number;
  };
}
