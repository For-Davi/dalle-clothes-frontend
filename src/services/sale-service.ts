import { api } from 'boot/axios';
import { createError } from 'src/composables/CreateNotify';

const baseUrl = 'sale';

export const getSalesService = (): Promise<{
  status: number;
  data: {
    sales: ISales[];
  };
}> => api.get(`${baseUrl}/`);

export const createSaleService = (
  data: IDataSale,
): Promise<{
  status: number;
  data: {
    sale: ISaleMade;
  };
}> => api.post(`${baseUrl}/`, data);

export const showSaleService = (
  saleID: number,
): Promise<{
  status: number;
  data: {
    couponData: ICouponData;
  };
}> => api.get(`${baseUrl}/${saleID}`);

export const sendCouponToEmailService = (
  saleID: number,
  email: string,
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.post(`${baseUrl}/send-to-email`, { saleID, email });

export const exportSaleService = async (saleID: number) => {
  try {
    const response = await api.post(
      `${baseUrl}/export`,
      {
        saleID: saleID,
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
    link.setAttribute('download', `venda_${timestamp}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    createError(error);
  }
};
