export const getLabelStatus = (value: string | null): { text: string } => {
  switch (value) {
    case 'canceled':
      return {
        text: 'Cancelado',
      };

    case 'completely_finished':
      return {
        text: 'Finalizado total',
      };

    case 'partial_finished':
      return {
        text: 'Finalizado parcial',
      };

    case 'waiting':
      return {
        text: 'Aguardando',
      };

    case 'conference':
      return {
        text: 'Conferência',
      };

    default:
      return {
        text: 'Indefinido',
      };
  }
};
