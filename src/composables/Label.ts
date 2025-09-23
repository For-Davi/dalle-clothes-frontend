export const getLabelStatusSupplierOrder = (value: string | null): string => {
  switch (value) {
    case 'canceled':
      return 'Cancelado';
      break;
    case 'completely_finished':
      return 'Completo total';
      break;
    case 'partial_finished':
      return 'Completo parcial';
      break;
    case 'waiting':
      return 'Aguardando';
      break;
    case 'conference':
      return 'Conferência';
      break;
    default:
      return '';
  }
};
