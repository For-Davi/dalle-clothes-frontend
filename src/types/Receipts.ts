export interface Receipt {
  id: number;
  identifier: string;
  type_receipt_id: number | null;
  type: {
    id: number;
    name: string;
  };
  active: number;
  enterprise_id: number;
  description: string | null;
}

export interface DataReceipt {
  id?: number;
  identifier: string;
  typesID: number | null;
  description: string | null;
}

export interface FilterReceipt {
  active: number | null;
}
