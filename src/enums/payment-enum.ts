export enum PaymentType {
  PIX = 'PIX',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBT_CARD = 'DEBT_CARD',
  MONEY = 'MONEY',
}

export const PaymentTypeLabels: Record<PaymentType, string> = {
  [PaymentType.PIX]: 'Pix',
  [PaymentType.CREDIT_CARD]: 'Cartão de Crédito',
  [PaymentType.DEBT_CARD]: 'Cartão de Débito',
  [PaymentType.MONEY]: 'Dinheiro',
};
