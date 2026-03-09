import { api } from 'boot/axios';

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
    exchanges: IExchanges[];
    message: string;
  };
}> => api.post(`${baseUrl}/difference`, data);
