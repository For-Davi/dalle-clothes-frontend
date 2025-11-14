export interface SupplierOrder {
  id: number;
  order_number: string;
  status: string;
  date_delivery_expected: string | null;
  date_issue: string;
}

export interface DataSupplierOrder {
  id?: number;
  supplierID: number | null;
  orderNumber: string | null;
  dateDeliveryExpected: string | null;
  dateIssue: string;
  items: IProductSupplierOrder[];
  itemsToDelete?: string[];
}

export interface ShowOrder {
  id: number;
  supplier_id: number;
  order_number: string;
  date_delivery_expected: string | null;
  date_issue: string | null;
  enterprise_id: number;
  status: string;
  created_by: number;
  cancellation_reason: string | null;
  date_received: string | null;
  observation: string | null;
  items: ISupplierOrderItem[];
}

export interface SupplierOrderItem {
  supplier_order_id: number;
  product_variant_id: number;
  product_variant: IVariant;
  total_cost: string;
  unit_cost: string;
  quantity_requested: number;
  quantity_received: number | null;
  date_received: string | null;
  finished: string | null;
}
