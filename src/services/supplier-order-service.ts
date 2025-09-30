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
    order: unknown;
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

export const deleteSupplierOrderService = (
  id: number,
): Promise<{
  status: number;
  data: {
    message: string;
    orders: ISupplierOrder[];
  };
}> => api.delete(`${baseUrl}/${id}`);
