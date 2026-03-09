export interface ReturnData {
  products: DataReturnItens[];
  reason: string;
  description: string;
}
export interface EditReturnData {
  id: number;
  saleID: number;
  status: string;
}
export interface Return {
  id: number;
  status: string;
  linked_return_id: number | null;
  created_by_name: string;
  created_by_email: string;
  updated_by_name: string | null;
  updated_by_email: string | null;
  created_at: string;
  updated_at: string;
  return_items: ReturnItem[];
  return_exchange_items: ReturnExchangeItem[];
}
export interface ReturnExchangeItem {
  product_name: string;
  product_sku: string | null;
  product_price: number;
  color: string | null;
  color_name: string | null;
  quantity: number;
  total: number;
}
export interface ReturnItem {
  product_name: string;
  product_sku: string | null;
  product_price: number;
  color: string | null;
  color_name: string | null;
  quantity: number;
  total: number;
  reason: string;
  description: string | null;
}

export interface StockReentryReturnItem {
  product_variant_id: number;
  product_name: string;
  product_sku: string | null;
  product_code: string | null;
  product_color: string | null;
  product_color_name: string | null;
  quantity: number;
}

export interface Returns {
  id: number;
  sale_id: number;
  linked_return_id: number | null;
  status: string;
  created_by_name: string;
  created_by_email: string;
  updated_by_name: string | null;
  updated_by_email: string | null;
  created_at: string;
  updated_at: string;
  return_exchange_items: ReturnExchangeItem[];
}
export interface DataReturnItens {
  product_variant_id: number;
  product_name: string;
  product_sku: string | null;
  product_price: number;
  quantity: number;
  returnQuantity: number;
  color: string | null;
  color_name: string | null;
  total: number;
}
export interface ReturnItens {
  product_variant_id: number;
  product_name: string;
  product_sku: string | null;
  product_price: number;
  color: string | null;
  color_name: string | null;
  quantity: number;
  total: number;
}
export interface DataCreateReturn {
  saleID: number;
  returnID: number | null;
  sellerID: number | null;
  returnData: IReturnData[];
  exchangeData: IExchangeData;
  exchangeProducts: IClientCartProduct[];
}
export interface DataCreateReturnLinked {
  saleID: number;
  returnID: number;
  returnData: IReturnData[];
  exchangeData: IExchangeData;
  exchangeProducts: IClientCartProduct[];
}
