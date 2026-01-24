export interface ReturnData {
  products: DataReturnItens[];
  reason: string;
  description: string;
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
  returnData: IReturnData[];
  exchangeData: IExchangeData;
  shiftProducts: IClientCartProduct[];
}
export interface DataCreateReturnLinked {
  returnID: number;
  returnData: IReturnData[];
  exchangeData: IExchangeData;
  shiftProducts: IClientCartProduct[];
}
