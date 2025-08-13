export interface FilterMovement {
  startDate: string;
  endDate: string;
  category: number | null;
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
