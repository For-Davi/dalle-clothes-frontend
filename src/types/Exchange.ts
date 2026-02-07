export interface ExchangeData {
  generatesCredit: 0 | 1;
  exchangeValue: number;
  differenceValue: number;
}

export interface ExchangePaymentData {
  additionalExchangePaymentData: AdditionalExchangePaymentMethodData;
  exchangePaymentData: ExchangePaymentMethodData[];
}

export interface DifferencePaymentData {
  additionalDifferencePaymentData: AdditionalDifferencePaymentMethodData;
  differencePaymentData: ExchangePaymentMethodData[];
  differenceDeliveryData: DeliveryData;
}

export interface ExchangePaymentMethodData {
  paymentType: string | null;
  value: string;
  receiptID: number | null;
  installment: { value: number | null; amount: string | null };
}

export interface AdditionalExchangePaymentMethodData {
  saleID: number;
  exchangeID: number;
  change: number;
  fees: number;
  description: string | null;
}
export interface AdditionalDifferencePaymentMethodData {
  saleID: number;
  exchangeID: number;
  change: number;
  fees: number;
  description: string | null;
}

export interface DeliveryData {
  freight: boolean;
  freightValue: string;
  cep: string | null;
  state: string | null;
  city: string | null;
  neighborhood: string | null;
  address: string | null;
  numberAddress: string | null;
  complement: string | null;
  recipientName: string | null;
  recipientPhone: string | null;
  observation: string | null;
}

export interface Exchanges {
  id: number;
  sale_id: number;
  return_id: number;
  status: string;
  exchange_value: number;
  difference_value: number;
  created_by_name: string;
  created_by_email: string;
  updated_by_name: string | null;
  updated_by_email: string | null;
  created_at: string;
  exchange_payment_method: ExchangePaymentMethod[];
  difference_payment_method: DifferencePaymentMethod[];
}

export interface Exchange {
  id: number;
  sale_id: number;
  return_id: number;
  status: string;
  exchange_value: number;
  difference_value: number;
  created_by_name: string;
  created_by_email: string;
  updated_by_name: string | null;
  updated_by_email: string | null;
  created_at: string;
  updated_at: string;
  change: number | null;
  description: string | null;
  exchange_payment_method: ExchangePaymentMethod[];
  difference_payment_method: DifferencePaymentMethod[];
}

export interface ExchangePaymentMethod {
  receipt_name: string;
  type_receipt_name: string;
  value: number;
}
export interface DifferencePaymentMethod {
  receipt_name: string;
  type_receipt_name: string;
  installments: number;
  value: number;
}
