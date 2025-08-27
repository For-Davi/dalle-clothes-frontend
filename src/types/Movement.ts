export interface FilterMovement {
  period: string | null;
  category: number | null;
  type: 'all' | 'entry' | 'out';
}

export interface ExportMovement {
  period: string | null;
  category: number | null;
  type: 'all' | 'entry' | 'out';
  format: 'excel' | 'pdf';
}

export interface Movement {
  id: number;
  enterprise_id: number;
  value: number;
  type: 'entry' | 'out';
  date: string;
  transaction_category_id: number | null;
  category: ICategoryTransaction | null;
  description: string | null;
}

export interface DataMovement {
  id?: number;
  type: 'entry' | 'out';
  transactionCategoryID: number | null;
  description: string | null;
  date: string;
  quantity: number;
  value: number;
}
