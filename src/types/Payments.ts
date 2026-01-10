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
      value: number | null;
      amount: string | null;
    };
  }>;
}

export interface DataSale {
  clientData: IVModelClient | null;
  saleData: {
    totalPrice: string;
    products: IDataProductSale[];
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
  };
  sellerID: number | null;
  paymentData: {
    change: string;
    fees: string | null;
    couponID: number | null;
    payment: Array<{
      paymentType: string;
      value: string;
      receiptID: number;
      installment: {
        value: number | null;
        amount: string | null;
      };
    }>;
  };
}

export interface Sales {
  id: number;
  enterprise_id: number;
  total: number;
  change: number;
  date: string;
  sale_payments_methods: ISalePaymentsMethods[];
}

export interface SaleMade {
  id: number;
  enterprise_id: number;
  seller_id: number | null;
  client_id: number | null;
  fees: string;
  total: string;
  change: string;
  date: string;
}
export interface Sale {
  id: number;
  enterprise_id: number;
  seller_id: number | null;
  client_id: number | null;
  fees: number;
  total: number;
  change: number;
  date: string;
  sale_itens: ISaleItens[];
  sale_payments_methods: ISalePaymentsMethods[];
  sale_delivery: ISaleDelivery;
}

export interface SaleItens {
  id: number;
  sale_id: number;
  product_variant_id: number;
  product_variant_name: string;
  product_sku: string | null;
  product_price: number;
  quantity: number;
  total: number;
}

export interface SalePaymentsMethods {
  sale_id: number;
  payment_method_id: number;
  receipt_id: number | null;
  receipt_name: string;
  installments: number;
  type: { name: string };
  value: number;
}

export interface SaleDelivery {
  sale_id: number;
  freight_value: number;
  cep: string | null;
  state: string | null;
  city: string | null;
  neighborhood: string | null;
  address: string | null;
  number_address: string | null;
  complement: string | null;
  recipient_name: string;
  recipient_phone: string;
  observation: string;
}

export interface CouponData {
  sale: {
    id: number;
    enterprise_id: number;
    fees: string;
    total: string;
    change: string;
    date: string;
  };
  enterprise: {
    id: number;
    name: string;
    cpf: string;
    cnpj: string;
  };
  client: {
    email: string | null;
  };
  products: {
    sale_id: number;
    product_variant_id: number;
    product_name: string;
    product_sku: string | null;
    product_price: string;
    quantity: number;
    total: string;
  }[];
}
