export interface Commission {
  created_at: string;
  type: string;
  return_id: number | null;
  product_name: string;
  seller_name: string;
  seller_email?: string | null;
  percentage?: number | null;
  commission_value?: number | null;
}

export interface CommissionPeriod {
  total_commission: string;
  seller_name: string;
  seller_id: number;
  period: string;
  sales_count: number;
}

export interface FilterCommission {
  startDate: string;
  endDate: string;
  sellerID: number | null;
}

export interface ExportCommissionDetailsSellerAndPeriod {
  sellerID: number;
  period: string;
}
