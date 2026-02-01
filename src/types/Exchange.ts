export interface ExchangeData {
  generatesCredit: 0 | 1;
  exchangeValue: number;
  differenceValue: number;
}

export interface ExchangePaymentMethodData {
  paymentType: string | null;
  value: string;
  receiptID: number | null;
}

export interface Exchanges {
  return_id: number;
  status: string;
  exchange_value: number;
  difference_value: number;
  created_by_name: string;
  created_by_email: string;
  updated_by_name: string | null;
  updated_by_email: string | null;
  created_at: string;
}

export interface Exchange {
  status: string;
  exchange_value: number;
  difference_value: number;
  created_by_name: string;
  created_by_email: string;
  updated_by_name: string | null;
  updated_by_email: string | null;
  created_at: string;
  updated_at: string;
  exchange_payment_method: ExchangePaymentMethod[];
}

export interface ExchangePaymentMethod {
  receipt_name: string;
  type_receipt_name: string;
  value: number;
  change: number;
}
