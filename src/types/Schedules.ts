export interface FilterSchedule {
  period: string | null;
  category: number | null;
  type: 'all' | 'entry' | 'out';
}

export interface Schedule {
  id: number;
  enterprise_id: number;
  value: number;
  type: 'entry' | 'out';
  date: string;
  transaction_category_id: number | null;
  category: ICategoryTransaction | null;
  description: string | null;
}

export interface DataSchedule {
  id?: number;
  type: 'entry' | 'out';
  transactionCategoryID: number | null;
  description: string | null;
  date: string;
  quantity: number;
  value: number;
}

export interface DataScheduleFinish {
  scheduleID: number;
  close: 'dateNow' | 'dateSchedule';
}
