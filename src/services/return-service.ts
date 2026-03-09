import { api } from 'boot/axios';

const baseUrl = 'returns';

export const getReturnService = (
  saleID: number,
): Promise<{
  status: number;
  data: {
    returns: IReturns[];
  };
}> => api.get(`${baseUrl}/${saleID}`);

export const showReturnService = (
  returnID: number,
): Promise<{
  status: number;
  data: {
    return: IReturn;
  };
}> => api.get(`${baseUrl}/return/${returnID}`);

export const getReturnItemsService = (
  returnID: number,
): Promise<{
  status: number;
  data: {
    products: IDataReturnItens[];
  };
}> => api.get(`${baseUrl}/linked/${returnID}`);

export const getStockReentryReturnItemsService = (): Promise<{
  status: number;
  data: {
    products: IStockReentryReturnItem[];
  };
}> => api.get(`${baseUrl}/stock/reentry`);

export const createReturnService = (
  data: IDataCreateReturn,
): Promise<{
  status: number;
  data: {
    returns: IReturns[];
    message: string;
  };
}> => api.post(`${baseUrl}/`, data);

export const updateReturnService = (
  id: number,
  saleID: number,
  status: string,
): Promise<{
  status: number;
  data: {
    returns: IReturns[];
    message: string;
  };
}> =>
  api.put(`${baseUrl}/`, {
    id,
    saleID,
    status,
  });

export const deleteReturnService = (
  saleID: number,
  returnID: number,
): Promise<{
  status: number;
  data: {
    returns: IReturns[];
    message: string;
  };
}> => api.delete(`${baseUrl}/${saleID}/${returnID}`);
