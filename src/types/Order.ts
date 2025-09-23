export interface SupplierOrder {
  id: number;
  order_number: string;
  status: string;
  date_delivery_expected: string | null;
  created_at: string;
}

export interface DataSupplierOrder {
  id?: number;
  orderNumber: string | null;
}
