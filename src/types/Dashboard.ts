export interface DashboardData {
  sales_made: number;
  sales_made_today: number;
  sales_value: number;
  movements_entry_value: number;
  movements_out_value: number;
  medium_ticket: number;
  categories_most_sold: {
    name: string;
    total_quantity: number;
  }[];
  receipts_value: {
    [key: string]: {
      name: string;
      total_quantity: number;
    };
  };
  records: {
    name: string;
    quantity: number;
  }[];
  sales_months_info: {
    quantity: Record<
      string,
      {
        label: string;
        data: number[];
      }
    >;
    total: Record<
      string,
      {
        label: string;
        data: number[];
      }
    >;
  };
  products: {
    labels: string[];
    quantity: number[];
    value: number[];
  };
  sellers: {
    labels: string[];
    quantity: number[];
    value: number[];
  };
}

export interface RecordsData {
  name: string;
  quantity: number;
}

export interface FilterDashboard {
  startDate: string;
  endDate: string;
  seller: number | null;
  category: number | null;
  product: string | null;
  typeReceipt: number | null;
}
