import { api } from 'boot/axios';
import { createError } from 'src/composables/CreateNotify';

const baseUrl = 'exchange';

export const getExchangesService = (
  saleID: number,
): Promise<{
  status: number;
  data: {
    exchanges: IExchanges[];
  };
}> => api.get(`${baseUrl}/${saleID}`);

export const showExchangeService = (
  exchangeID: number,
): Promise<{
  status: number;
  data: {
    exchange: IExchange;
  };
}> => api.get(`${baseUrl}/exchange/${exchangeID}`);

export const createExchangePaymentService = (
  data: IExchangePaymentData,
): Promise<{
  status: number;
  data: {
    exchanges: IExchanges[];
    message: string;
  };
}> => api.post(`${baseUrl}/`, data);

export const createDifferencePaymentService = (
  data: IDifferencePaymentData,
): Promise<{
  status: number;
  data: {
    exchangeTaxCoupon: IExchangeCouponData;
    message: string;
  };
}> => api.post(`${baseUrl}/difference`, data);

export const sendCouponToEmailService = (
  exchangeID: number,
  email: string,
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.post(`${baseUrl}/send-to-email`, { exchangeID, email });

export const exportExchangeService = async (exchangeID: number) => {
  try {
    const response = await api.post(
      `${baseUrl}/export`,
      {
        exchangeID: exchangeID,
      },
      {
        responseType: 'blob',
      },
    );

    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:]/g, '').replace(/\..+/, '');

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `troca_${timestamp}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    createError(error);
  }
};
