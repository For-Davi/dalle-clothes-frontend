export const getLabelStatus = (value: string | null): { text: string; color: string } => {
  switch (value) {
    case 'canceled':
      return {
        text: 'Cancelado',
        color: 'red',
      };

    case 'completely_finished':
      return {
        text: 'Completo total',
        color: 'green',
      };

    case 'partial_finished':
      return {
        text: 'Completo parcial',
        color: 'yellow',
      };

    case 'waiting':
      return {
        text: 'Aguardando',
        color: 'grey',
      };

    case 'conference':
      return {
        text: 'Conferência',
        color: 'blue',
      };

    default:
      return {
        text: 'Indefinido',
        color: 'grey',
      };
  }
};
