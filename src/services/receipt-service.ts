import { api } from 'boot/axios';

const baseUrl = 'receipt';

export const getReceiptsService = (): Promise<{
  status: number;
  data: {
    receipts: IReceipt[];
  };
}> => api.get(`${baseUrl}`);

export const showReceiptService = (
  receiptID: number,
): Promise<{
  status: number;
  data: {
    receipt: IReceipt;
  };
}> => api.get(`${baseUrl}/${receiptID}`);

export const createReceiptService = (
  receipt: IDataReceipt,
): Promise<{
  status: number;
  data: {
    receipts: IReceipt[];
    message: string;
  };
}> => api.post(`${baseUrl}/`, receipt);

export const updateReceiptService = (
  id: number,
  identifier: string,
  typesID: number | null,
  active: number,
  description: string | null,
): Promise<{
  status: number;
  data: {
    receipts: IReceipt[];
    message: string;
  };
}> =>
  api.put(`${baseUrl}/`, {
    id,
    identifier,
    typesID,
    active,
    description,
  });

export const deleteReceiptService = (
  receiptID: number,
): Promise<{
  status: number;
  data: {
    receipts: IReceipt[];
    message: string;
  };
}> => api.delete(`${baseUrl}/${receiptID}`);
