import { api } from 'boot/axios';

const baseUrl = 'receipt';

export const getReceiptsService = (): Promise<{
  status: number;
  data: {
    receipts: IReceipt[];
  };
}> => api.get(`${baseUrl}`);

export const createReceiptService = (
  data: IDataReceipt,
): Promise<{
  status: number;
  data: {
    receipts: IReceipt[];
    message: string;
  };
}> => api.post(`${baseUrl}/`, data);

export const updateReceiptService = (
  data: IDataReceipt,
): Promise<{
  status: number;
  data: {
    receipts: IReceipt[];
    message: string;
  };
}> => api.put(`${baseUrl}/`, data);

export const deleteReceiptService = (
  id: number,
): Promise<{
  status: number;
  data: {
    receipts: IReceipt[];
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);
