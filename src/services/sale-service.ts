import { api } from 'boot/axios';

const baseUrl = 'sale';

export const createSaleService = (
  data: IDataSale,
): Promise<{
  status: number;
}> => api.post(`${baseUrl}/`, data);
