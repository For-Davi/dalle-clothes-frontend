export interface Subscriptions {
  id: number;
  name: string;
}

export interface QrCode {
  encodedImage: string;
  payload: string;
}

export interface PaymentSubscriptionCreditCard {
  subscriptionID: number;
  creditCard: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  creditCardHolderInfo: {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    addressComplement: string | null;
    phone: string;
  };
}

export interface VMPaymentSubscriptionCreditCard {
  subscriptionID: number;
  creditCard: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  creditCardHolderInfo: {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    addressComplement: string | null;
    phone: string;
  };
}
