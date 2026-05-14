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
  status: string;
  seller_name: string;
  client_name: string;
  total: number;
  change: number;
  date: string;
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
  status: string;
  seller_id: number | null;
  seller_name: string | null;
  client_id: number | null;
  client_name: string | null;
  fees: number;
  starting_total: number;
  current_total: number;
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
  product_name: string;
  product_sku: string | null;
  product_code: number | null;
  product_price: number;
  product_discount: number;
  product_discount_value: number;
  quantity: number;
  returnQuantity?: number;
  total: number;
  grid: string;
  color: string;
  color_name: string;
  quantity_delivered: number | null;
  delivered: number;
}

export interface SalePaymentsMethods {
  sale_id: number;
  payment_method_id: number;
  receipt_id: number | null;
  receipt_name: string;
  installments: number;
  type: string;
  receipt: string;
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
  delivery_guy_name: string | null;
  delivery_guy_phone: string | null;
  status: string;
}

export interface DataSaleCancellation {
  saleID: number | null;
  reason: string | null;
  description: string;
}
export interface SaleCancellation {
  created_by_name: string;
  created_by_email: string;
  reason: string;
  description: string | null;
  created_at: string;
}

export interface CouponData {
  sale: {
    id: number;
    enterprise_id: number;
    fees: string;
    starting_total: string;
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
    product_variant_id: number;
    product_name: string;
    product_sku: string | null;
    product_price: string;
    quantity: number;
    total: string;
  }[];
}

export interface FilterSale {
  startDate: string | null;
  endDate: string | null;
  status: null | 'active' | 'canceled';
  client: number | null;
  seller: number | null;
  product: number | null;
  paymentType: number | null;
  receipt: number | null;
  minTotal: string | null;
  maxTotal: string | null;
}
