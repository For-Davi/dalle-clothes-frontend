import { createError } from 'src/composables/CreateNotify';
import { api } from 'boot/axios';

const baseUrl = 'supplier/order';

export const getSupplierOrdersService = (): Promise<{
  status: number;
  data: {
    orders: ISupplierOrder[];
  };
}> => api.get(`${baseUrl}`);

export const showSupplierOrderService = (
  orderID: number,
): Promise<{
  status: number;
  data: {
    order: IShowOrder;
  };
}> => api.get(`${baseUrl}/${orderID}`);

export const createSupplierOrderService = (
  data: IDataSupplierOrder,
): Promise<{
  status: number;
  data: {
    orders: ISupplierOrder[];
    message: string;
  };
}> => api.post(`${baseUrl}/`, data);

export const updateSupplierOrderService = (
  data: IDataSupplierOrder,
): Promise<{
  status: number;
  data: {
    orders: ISupplierOrder[];
    message: string;
  };
}> => api.put(`${baseUrl}/`, data);

export const saveReceivedOrderService = (
  data: IDataSupplierOrderReceived,
): Promise<{
  status: number;
  data: {
    order: IShowOrder;
    message: string;
  };
}> => api.put(`${baseUrl}/received`, data);

export const exportOrderService = async (orderID: number) => {
  try {
    const response = await api.post(
      `${baseUrl}/export`,
      { orderID },
      {
        responseType: 'blob',
      },
    );

    const ext = 'pdf';

    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:]/g, '').replace(/\..+/, '');

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `pedido_${timestamp}.${ext}`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    createError(error);
  }
};

export const deleteSupplierOrderService = (
  id: number,
): Promise<{
  status: number;
  data: {
    message: string;
    orders: ISupplierOrder[];
  };
}> => api.delete(`${baseUrl}/${id}`);
