export enum ReturnReason {
  DEFECT = 'defect',
  VIOLATED = 'violated',
  OUT_OF_STANDARD = 'out_of_standard',
  WRONG_SENT = 'wrong_sent',
  DELIVERY_DELAY = 'delivery_delay',
  WRONG_BOUGHT = 'wrong_bought',
  DISSATISFACTION = 'dissatisfaction',
  DUPLICATE_ORDER = 'duplicate_order',
  INCOMPATIBLE = 'incompatible',
  REGRET = 'regret',
  PAYMENT_ISSUE = 'payment_issue',
  NOT_INFORMED = 'not_informed',
}

export const ReturnReasonLabels: Record<ReturnReason, string> = {
  [ReturnReason.DEFECT]: 'Produto com defeito',
  [ReturnReason.VIOLATED]: 'Produto violado',
  [ReturnReason.OUT_OF_STANDARD]: 'Produto diferente do padrão',
  [ReturnReason.WRONG_SENT]: 'Produto errado enviado',
  [ReturnReason.DELIVERY_DELAY]: 'Atraso na entrega',
  [ReturnReason.WRONG_BOUGHT]: 'Produto errado comprado',
  [ReturnReason.DISSATISFACTION]: 'Insatisfação do cliente',
  [ReturnReason.DUPLICATE_ORDER]: 'Compra duplicada',
  [ReturnReason.INCOMPATIBLE]: 'Incompatibilidade',
  [ReturnReason.REGRET]: 'Desistência / Arrependimento',
  [ReturnReason.PAYMENT_ISSUE]: 'Problemas com pagamento',
  [ReturnReason.NOT_INFORMED]: 'Não informado',
};
