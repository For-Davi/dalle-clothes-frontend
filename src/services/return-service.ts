import { api } from 'boot/axios';
import { createError } from 'src/composables/CreateNotify';

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
    coupon: IExchangeCouponData | null;
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

export const sendCouponToEmailService = (
  returnID: number,
  email: string,
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.post(`${baseUrl}/send-to-email`, { returnID, email });

export const exportExchangeService = async (returnID: number) => {
  try {
    const response = await api.post(
      `${baseUrl}/export`,
      {
        returnID: returnID,
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
