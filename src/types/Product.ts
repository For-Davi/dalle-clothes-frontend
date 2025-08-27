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
  code: string;
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
  code: string;
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
    minStockAlert: number;
    sku: string | null;
    code: string | null;
    active: number;
    description: string | null;
    location: string | null;
    gridItemID: number | null;
    colors: { id: number }[];
  }[];
  images: IMediaItem[];
  tags: { id: number }[];
  advanced: ProductAdvanced;
}
export interface ProductAdvanced {
  active: number;
  allowCoupon: number;
  allowDiscount: number;
  discountMaxPercentage: number;
  hasCommission: number;
  commissionPercentage: number;
}
export interface DataUpdateVariant {
  id: number;
  price: number;
  offer: number;
  cost: number;
  stockQuantity: number;
  minStockAlert: number;
  sku: string | null;
  code: string | null;
  active: number;
  description: string | null;
  location: string | null;
  colorID: number | null;
}

export interface Product {
  product_variant_id: number;
  price: number;
  stock_quantity: number;
  sku: string;
  code: string;
  variant_active: number;
  color: {
    name: string;
    hex_color_code: string;
  } | null;
}

export interface ShowProduct {
  id: number;
  name: string;
  type: string;
  active: number;
  enterprise_id: number;
  product_category_id: number | null;
  description: string | null;
  variants: Variant[];
  tags: ITag[];
  logs: ILog[];
  images: IImage[];
  advanced: {
    active: number;
    allow_coupon: number;
    allow_discount: number;
    discount_max_percentage: number;
    has_commission: number;
    commission_percentage: number;
  };
  category: ICategoryProduct | null;
}

export interface FilterProduct {
  name: string | null;
  sku: string | null;
  active: number | null;
  category: number | null;
  stockCritical: number | null;
}

export interface Variant {
  id: number;
  price: string;
  cost: string;
  offer: string;
  stock_quantity: number;
  min_stock_alert: number;
  sku: string | null;
  code: string | null;
  active: number;
  color_id: number | null;
  color: IColor | null;
  enterprise_id: number;
  description: string | null;
  location: string | null;
  product_id: number | null;
  grid_item_id: number;
  grid_item: {
    id: number;
    order: number;
    size: string;
    grid_group_id: number;
    grid_group: {
      id: number;
      name: string;
      active: number;
    };
  } | null;
}

export interface DataProductAdvanced {
  productID: number;
  active: number;
  allowCoupon: number;
  allowDiscount: number;
  discountMaxPercentage: number;
  hasCommission: number;
  commissionPercentage: number;
}

export interface DataProductBasic {
  productID: number;
  name: string;
  description: string | null;
  type: string;
  category: number | null;
}
export interface ProductBasic {
  name: string;
  description: string | null;
  type: string;
  category: ICategoryProduct | null;
}

export interface DataMovementProductRegister {
  variantID: number;
  documentNumber: string | null;
  description: string | null;
  lotNumber: string | null;
  quantity: number;
  unitCost: number;
  totalCost: number;
  reason: string;
  type: 'in' | 'out';
  supplierID: number | null;
}

export interface ReturnProductAdvanced {
  active: number;
  allow_coupon: number;
  allow_discount: number;
  discount_max_percentage: number;
  has_commission: number;
  commission_percentage: number;
}

export interface LinkedProducts {
  supplier_id: number;
  product_variant_id: number;
  name: string;
  sku: string | null;
  price: number;
  description: string | null;
}

export interface SearchProductVariant {
  product_variant_id: number;
  active: number;
  price: string;
  cost: string;
  name: string;
  location: string | null;
  sku: string | null;
  stock_quantity: number;
  variant_active: number;
  color_id: number | null;
  color: IColor | null;
  description: string | null;
  product_id: number;
  product: {
    id: number;
    name: string;
  };
  grid_item_id: number;
  grid_item: {
    id: number;
    order: number;
    size: string;
    grid_group_id: number;
    grid_group: {
      id: number;
      name: string;
      active: number;
    };
  } | null;
}
