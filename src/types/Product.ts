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
  type: QuasarSelect<string>;
  category: QuasarSelect<number | null>;
}

export interface VModelProductAdvanced {
  active: number;
  allowCoupon: number;
  allowDiscount: number;
  discountMaxPercentage: string;
}
