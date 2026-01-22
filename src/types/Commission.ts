export interface Commission {
  created_at: string;
  status: string;
  type: string;
  product_name: string;
  seller_name: string;
  seller_email?: string | null;
  percentage?: number | null;
  commission_value?: number | null;
}
