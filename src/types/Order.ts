export interface SupplierOrder {
  id: number;
  order_number: string;
  status: string;
  date_delivery_expected: string | null;
  date_issue: string;
}

export interface DataSupplierOrder {
  id?: number;
  orderNumber: string | null;
  date_delivery_expected: string | null;
  date_issue: string;
}
