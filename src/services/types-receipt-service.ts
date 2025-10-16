import { api } from 'boot/axios';

const baseUrl = 'receipt/type';

export const getTypesReceiptService = (): Promise<{
  status: number;
  data: {
    types: ITypesReceipt[];
  };
}> => api.get(`${baseUrl}`);
