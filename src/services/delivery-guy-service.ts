import { api } from 'boot/axios';

const baseUrl = 'delivery-guy';

export const getDeliveryGuysService = (): Promise<{
  status: number;
  data: {
    deliveriesGuys: IDeliveryGuy[];
  };
}> => api.get(`${baseUrl}/`);

export const showDeliveryGuyService = (
  deliveryGuyID: number,
): Promise<{
  status: number;
  data: {
    deliveryGuy: IDeliveryGuy;
  };
}> => api.get(`${baseUrl}/${deliveryGuyID}`);

export const createDeliveryGuyService = (
  data: IDeliveryGuy,
): Promise<{
  status: number;
  data: {
    deliveryGuys: IDeliveryGuy[];
    message: string;
  };
}> => api.post(`${baseUrl}/`, data);

export const updateDeliveryGuyService = (
  deliveryGuyID: number,
  name: string,
  email: string | null,
  cpf: string | null,
  phone: string | null,
  vehicle: string,
): Promise<{
  status: number;
  data: {
    message: string;
    deliveriesGuys: IDeliveryGuy[];
  };
}> => api.put(`${baseUrl}/`, { deliveryGuyID, name, email, cpf, phone, vehicle });

export const deleteDeliveryGuyService = (
  deliveryGuyID: number,
): Promise<{
  status: number;
  data: {
    message: string;
    deliveriesGuys: IDeliveryGuy[];
  };
}> => api.delete(`${baseUrl}/${deliveryGuyID}`);
