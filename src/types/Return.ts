export interface ReturnData {
  products: IReturnItens[];
  reason: string;
  description: string;
}
export interface ReturnItens {
  product_variant_id: number;
  product_name: string;
  product_sku: string | null;
  product_price: number;
  quantity: number;
  returnQuantity: number;
  color: string;
  color_name: string;
  total: number;
}
export interface DataCreateReturn {
  saleID: number;
  returnData: IReturnData[];
  returnValue: number;
  shiftProducts: IClientCartProduct[];
}
