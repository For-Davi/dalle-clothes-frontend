import { api } from 'boot/axios';

const baseUrl = 'receipt/type';

export const getTypesReceiptService = (): Promise<{
  status: number;
  data: {
    types: ITypesReceipt[];
  };
}> => api.get(`${baseUrl}`);

export const createTypesReceiptService = (
  name: string,
): Promise<{
  status: number;
  data: {
    message: string;
    types: ITypesReceipt[];
  };
}> => api.post(`${baseUrl}/`, { name });

export const updateTypesReceiptService = (
  id: number,
  name: string,
): Promise<{
  status: number;
  data: {
    message: string;
    types: ITypesReceipt[];
  };
}> =>
  api.put(`${baseUrl}/`, {
    id,
    name,
  });

export const deleteTypesReceiptService = (
  id: number,
): Promise<{
  status: number;
  data: {
    message: string;
    types: ITypesReceipt[];
  };
}> => api.delete(`${baseUrl}/${id}`);
