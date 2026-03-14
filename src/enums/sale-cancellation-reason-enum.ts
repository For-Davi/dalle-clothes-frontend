export enum SaleCancellationReason {
  NOT_INFORMED = 'not_informed',
  REGRET = 'regret',
  DELIVERY_DELAY = 'delivery_delay',
  WRONG_PRODUCT = 'wrong_product',
  OUT_OF_STOCK = 'out_of_stock',
  PAYMENT_FAILURE = 'payment_failure',
  MISTAKEN_PURCHASE = 'mistaken_purchase',
  DUPLICATE_SALE = 'duplicate_sale',
  INCORRECT_DATA = 'incorrect_data',
  FRAUD = 'fraud',
  CUSTOMER_RESTRICTION = 'customer_restriction',
}

export const SaleCancellationLabels: Record<SaleCancellationReason, string> = {
  [SaleCancellationReason.NOT_INFORMED]: 'Não informado',
  [SaleCancellationReason.REGRET]: 'Desistência/Arrependimento',
  [SaleCancellationReason.DELIVERY_DELAY]: 'Atraso na entrega',
  [SaleCancellationReason.WRONG_PRODUCT]: 'Produto(s) errado(s) entregado(s)',
  [SaleCancellationReason.OUT_OF_STOCK]: 'Produto(s) com falta de estoque',
  [SaleCancellationReason.PAYMENT_FAILURE]: 'Impossibilidade de pagamento',
  [SaleCancellationReason.MISTAKEN_PURCHASE]: 'Compra por engano',
  [SaleCancellationReason.DUPLICATE_SALE]: 'Venda duplicada',
  [SaleCancellationReason.INCORRECT_DATA]: 'Dados incorretos (pagamentos, cliente, entrega)',
  [SaleCancellationReason.FRAUD]: 'Fraude/Transação suspeita',
  [SaleCancellationReason.CUSTOMER_RESTRICTION]: 'Cliente com restrição cadastral ou legal',
};
