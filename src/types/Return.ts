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
  total: number;
}
