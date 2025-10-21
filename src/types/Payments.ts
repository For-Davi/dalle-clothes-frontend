export interface VModelSalePayment {
  sellerID: number | null;
  change: string;
  freight: boolean;
  freightValue: string;
  cep: string | null;
  state: string | null;
  city: string | null;
  neighborhood: string | null;
  address: string | null;
  numberAddress: string | null;
  complement: string;
  recipientName: string;
  recipientPhone: string;
  observation: string | null;
  fees: string | null;
  couponID: number | null;
  payment: Array<{
    paymentType: string | null;
    value: string;
    receiptID: number | null;
    installment: {
      value: number;
      amount: string;
    } | null;
  }>;
}

export interface DataSale {
  clientData: IVModelClient;
  saleData: {
    totalPrice: string;
    products: IClientCartProduct[];
  };
  deliveryData: {
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
  paymentData: {
    sellerID: number | null;
    change: string;
    fees: string | null;
  couponID: number | null;
  payment: Array<{
    paymentType: string;
    value: string;
    receiptID: number;
    installment: {
      value: number;
      amount: string;
    } | null;
  }>;
  }
}
